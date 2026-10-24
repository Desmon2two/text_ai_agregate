import { Client } from "pg";
import handleFailure from "../infrastructure/failureHandler.js";
import mapErrorToAttemptError from "../infrastructure/utils/errorToProviderErrorMapper.js";
import mapJobToAiRequest from "../infrastructure/utils/JobToAiRequestMapper.js";
import jobRepository from "../jobFeature/jobRepository.js";
import attemptRepository from "../jobFeature/attemptRepository.js";
import attemptService from "../jobFeature/attemptService.js";
import eventRepository from "../jobFeature/eventRepository.js";
import jobService from "../jobFeature/jobService.js";
import { Job, Worker } from "bullmq";
import { connection } from "./queueService.js";
const worker = new Worker("dispatchQueue", async (job) => {
    await job.updateProgress({ job_id });
    return 'some value';
}, { connection });
async function processJobFromBeginning(dbClient, job_id, provider, model) {
    try {
        await dbClient.query("BEGIN");
        const job = await jobRepository.markProcessing(dbClient, job_id);
        if (job === null)
            throw new Error("Job was not created");
        await eventRepository.createJobProcessingEvent(dbClient, job_id);
        const attempt = await attemptService.createAttempt(dbClient, job_id, provider, model);
        if (attempt === null)
            throw new Error("Attempt was not created");
        await eventRepository.createAttemptCreatedEvent(dbClient, attempt.attempt_id, { origin: "Regular Job Processing" });
        await dbClient.query("COMMIT");
        await executeAttempt(dbClient, attempt.attempt_id);
    }
    catch (error) {
        await dbClient.query("ROLLBACK");
        throw error;
    }
}
async function processJobFromIntermediateState(dbClient, job_id, provider, model) {
    const job = await jobRepository.getJobById(dbClient, job_id);
    if (job === null) {
        throw new Error("No such job to process from intermediate state");
    }
    try {
        await eventRepository.createJobProcessedFromIntermediateStateEvent(dbClient, job.job_id);
        if (job.state === "CREATED") {
            await queueService.enqueue(dbClient, job.job_id);
        }
        if (job.state === "QUEUED") {
            if (!provider || !model)
                throw new Error("Can't process this job - not listed provider or model");
            await processJobFromBeginning(dbClient, job.job_id, provider, model);
        }
        if (job.state === "PROCESSING") {
            const attempts = await jobRepository.getAttemptsPerJob(dbClient, job.job_id);
            if (attempts === null) {
                throw new Error("No such attempt to process from intermediate state");
            }
            await executeAttempt(dbClient, attempts[0].attempt_id);
        }
    }
    catch (error) {
        throw error;
    }
}
async function executeAttempt(dbClient, attemptId) {
    const attempt = await attemptRepository.getAttempt(dbClient, attemptId);
    if (attempt === null) {
        throw new Error("No such attempt");
    }
    const { attempt_id, job_id, retryable, provider } = attempt;
    const job = await jobRepository.getJobById(dbClient, job_id);
    if (job === null)
        throw new Error("No such job");
    try {
        await dbClient.query("BEGIN");
        try {
            await attemptRepository.markSending(dbClient, attempt_id);
            await eventRepository.createSendingRequestEvent(dbClient, attempt_id);
            await dbClient.query("COMMIT");
        }
        catch (error) {
            await dbClient.query("ROLLBACK");
        }
        const aiRequest = mapJobToAiRequest(job);
        const providerJobId = await aiProvider.send(dbClient, aiRequest);
        if (providerJobId !== null) {
            try {
                await dbClient.query("BEGIN");
                await attemptRepository.markWaiting(dbClient, attempt_id, providerJobId);
                await eventRepository.createWaitingForResponseEvent(dbClient, attempt_id, { providerJobId });
                await dbClient.query("COMMIT");
            }
            catch (error) {
                await dbClient.query("ROLLBACK");
            }
        }
        const response = await aiProvider.receive(dbClient, aiRequest);
        try {
            await dbClient.query("BEGIN");
            await attemptRepository.markReceived(dbClient, attempt_id, response);
            await eventRepository.createResponseReceivedEvent(dbClient, attempt_id);
            await dbClient.query("COMMIT");
        }
        catch (error) {
            await dbClient.query("ROLLBACK");
        }
        await validateAiResponse(response);
        try {
            await dbClient.query("BEGIN");
            await attemptRepository.markValidated(dbClient, attempt_id, response);
            await eventRepository.createResponseValidatedEvent(dbClient, attempt_id);
            await dbClient.query("COMMIT");
        }
        catch (error) {
            await dbClient.query("ROLLBACK");
        }
        await jobService.completeJob(dbClient, job.job_id, attempt_id);
    }
    catch (error) {
        const attemptError = mapErrorToAttemptError(error, retryable, provider, error.code);
        await handleFailure(dbClient, attempt_id, attemptError);
        throw error;
    }
}
export { processJobFromIntermediateState, worker };
