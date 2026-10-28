import handleFailure from "../infrastructure/failureHandler.js";
import mapErrorToAttemptError from "../infrastructure/utils/errorToProviderErrorMapper.js";
import jobRepository from "../jobFeature/jobRepository.js";
import attemptRepository from "../jobFeature/attemptRepository.js";
import eventRepository from "../jobFeature/eventRepository.js";
import { Job, Worker } from "bullmq";
import queueService, { connection } from "./queueService.js";
import jobUseCase from "../jobFeature/jobUseCase.js";
import localAiService from "../aiFeature/aiServices/localAiService.js";
import { setupTestDB, teardownTestDB, } from "../../tests/helpers/testDatabase.js";
import { nonSecretVariables } from "../infrastructure/utils/nonSecretVariables.js";
import jobService from "../jobFeature/jobService.js";
import attemptService from "../jobFeature/attemptService.js";
const worker = new Worker("dispatchQueue", async (bullJob) => {
    let dbClient;
    nonSecretVariables.getProjectState() === "test"
        ? (dbClient = await setupTestDB())
        : (dbClient = await setupProdDB());
    worker.on("error", (error) => {
        console.error("BullMQ worker error:", error);
    });
    worker.on("failed", (job, error, prev) => {
        console.error("Job failed:", {
            jobId: job?.data,
            progress: job?.progress,
            message: error.message,
            stack: error.stack,
            previousState: prev,
        });
    });
    worker.on("completed", (job_id) => {
        console.log("Worker completed job:", job_id.data);
    });
    worker.on("progress", ({ progress }) => {
        console.log("Worker progress:", progress);
    });
    try {
        const { job_id, attempt_id } = bullJob.data;
        await bullJob.updateProgress("Initialized");
        await processJobFromBeginning(dbClient, bullJob, job_id, attempt_id);
    }
    catch (error) {
        console.error("Job processor threw:", error);
        throw error;
    }
    finally {
        nonSecretVariables.getProjectState() === "test"
            ? await teardownTestDB(dbClient)
            : await teardownProdDB();
    }
}, { connection });
async function processJobFromBeginning(dbClient, bullJob, job_id, attempt_id) {
    await bullJob.updateProgress(`Worker started job ${job_id}, attempt ${attempt_id}`);
    try {
        await dbClient.query("BEGIN");
        await jobService.markProcessing(dbClient, job_id);
        await dbClient.query("COMMIT");
        await bullJob.updateProgress(`Job: ${job_id}, attempt: ${attempt_id}. The job was marked processing and fully accepted for work. Starting attempt execution`);
        await executeAttempt(dbClient, bullJob, attempt_id);
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
    await eventRepository.createJobProcessedFromIntermediateStateEvent(dbClient, job.job_id);
    if (job.state === "CREATED") {
        await queueService.addJobToDispatchQueue(undefined, {
            dbClient,
            job_id: job.job_id,
        });
    }
    if (job.state === "QUEUED") {
        if (!provider || !model)
            throw new Error("Can't process this job - not listed provider or model");
        await processJobFromBeginning(dbClient, job.job_id);
    }
    if (job.state === "PROCESSING") {
        const attempts = await jobRepository.getAttemptByIdsPerJob(dbClient, job.job_id);
        if (attempts === null) {
            throw new Error("No such attempt to process from intermediate state");
        }
        await executeAttempt(dbClient, attempts[0].attempt_id);
    }
}
async function executeAttempt(dbClient, bullJob, attemptId) {
    const attempt = await attemptRepository.getAttemptById(dbClient, attemptId);
    if (attempt === null) {
        throw new Error("No such attempt");
    }
    const { attempt_id, job_id, retryable, provider } = attempt;
    const job = await jobRepository.getJobById(dbClient, job_id);
    if (job === null)
        throw new Error("No such job");
    try {
        await bullJob.updateProgress(`Job: ${job_id}, attempt: ${attempt_id}. Initial validation checks passed.`);
        try {
            await dbClient.query("BEGIN");
            await attemptService.markSending(dbClient, attempt_id);
            await dbClient.query("COMMIT");
            await bullJob.updateProgress(`Job: ${job_id}, attempt: ${attempt_id}. Attempt was successfully marked as sending`);
        }
        catch (error) {
            await dbClient.query("ROLLBACK");
            console.error("Failed to mark attempt sending:", error);
            throw error;
        }
        const { received_data, input_tokens, output_tokens } = await localAiService.acceptJob(job.body.prompt);
        await bullJob.updateProgress(`Job: ${job_id}, attempt: ${attempt_id}. The request returned a response`);
        // if (providerJobId !== null) {
        //   try {
        //     await dbClient.query("BEGIN");
        //     await attemptRepository.markWaiting(
        //       dbClient,
        //       attempt_id,
        //       providerJobId,
        //     );
        //     await eventRepository.createWaitingForResponseEvent(
        //       dbClient,
        //       attempt_id,
        //       { providerJobId },
        //     );
        //     await dbClient.query("COMMIT");
        //   } catch (error) {
        //     await dbClient.query("ROLLBACK");
        //   }
        // }
        // const response = await aiProvider.receive(dbClient, aiRequest);
        try {
            await dbClient.query("BEGIN");
            await attemptService.markReceived(dbClient, attempt_id, {
                tokens: { input_tokens, output_tokens },
                received_data,
            });
            await dbClient.query("COMMIT");
            await bullJob.updateProgress(`Job: ${job_id}, attempt: ${attempt_id}. The attempt was marked as received`);
        }
        catch (error) {
            await dbClient.query("ROLLBACK");
            console.error("Failed to mark attempt received:", error);
            throw error;
        }
        // THINK ABOUT HOW TO VALIDATE OUTPUT
        try {
            await dbClient.query("BEGIN");
            await attemptService.markValidated(dbClient, attempt_id, {
                tokens: { input_tokens, output_tokens },
                validated_data: received_data,
            });
            await dbClient.query("COMMIT");
            await bullJob.updateProgress(`Job: ${job_id}, attempt: ${attempt_id}. The attempt was marked as validated`);
        }
        catch (error) {
            await dbClient.query("ROLLBACK");
            console.error("Failed to mark attempt validated:", error);
            throw error;
        }
        try {
            await bullJob.updateProgress(`Job: ${job_id}, attempt: ${attempt_id}. Starting the final job completion step`);
            await dbClient.query("BEGIN");
            await jobUseCase.completeJob(dbClient, job.job_id, attempt_id, {
                tokens: { input_tokens, output_tokens },
                received_data,
            });
            await dbClient.query("COMMIT");
            await bullJob.updateProgress(`Job: ${job_id}, attempt: ${attempt_id}. Job fully completed`);
        }
        catch (error) {
            await dbClient.query("ROLLBACK");
            console.error("Failed to mark job and attempt complete:", error);
            throw error;
        }
    }
    catch (error) {
        const attemptError = mapErrorToAttemptError(error, retryable, provider, error.code);
        await handleFailure(dbClient, attempt_id, attemptError);
        throw error;
    }
}
export { processJobFromIntermediateState, worker };
