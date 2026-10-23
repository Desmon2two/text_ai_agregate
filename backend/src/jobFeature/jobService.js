import attemptRepository from "./attemptRepository.js";
import jobRepository from "./jobRepository.js";
import eventRepository from "./eventRepository.js";
import { Client } from "pg";
import { mapTokensToActualCost } from "../FinancesFeature/finService.js";
async function createJob(dbClient, type, estimated_cost, user_id, provider, model, body, filesUrl) {
    try {
        await dbClient.query("BEGIN");
        const job = await jobRepository.createJob({
            dbClient,
            type,
            body,
            user_id,
            estimated_cost,
        });
        if (job === null)
            throw new Error("Job was not created");
        const attempt = await attemptRepository.createAttempt({
            dbClient,
            job_id: job.job_id,
            attempt_number: 1,
            provider,
            model,
        });
        if (attempt === null)
            throw new Error("Attempt was not created");
        await eventRepository.createAttemptCreatedEvent(dbClient, attempt.attempt_id, { origin: "Regular job creation" });
        await eventRepository.createJobAcceptedEvent(dbClient, job.job_id);
        await dbClient.query("COMMIT");
        await queueService.enqueue(job.job_id);
        return {
            job_id: job.job_id,
            created_at: job.created_at,
        };
    }
    catch (error) {
        await dbClient.query("ROLLBACK");
        throw new Error(error.message);
    }
}
async function completeJob(dbClient, job_id, attempt_id) {
    const job = await jobRepository.getJobById(dbClient, job_id);
    if (job === null)
        throw new Error("No such job for completeJob");
    if (job.state !== "PROCESSING")
        throw new Error("Job is not in processing state");
    const attempt = await attemptRepository.getAttempt(dbClient, attempt_id);
    if (attempt === null)
        throw new Error("No attempt for completeJob");
    if (attempt.state !== "VALIDATED")
        throw new Error("Attempt is not in validated state");
    if (typeof attempt.data === "undefined" || attempt.data === null || !attempt.data)
        throw new Error("Data is absent");
    await dbClient.query("BEGIN");
    try {
        const attemptResult = await attemptRepository.markCompleted(dbClient, attempt_id, attempt.data);
        if (attemptResult === null)
            throw Error("Complete job operation failed at mark attempt completed");
        const { fullPrice } = await mapTokensToActualCost(dbClient, attempt.model, attempt.data.tokens.input_tokens, attempt.data.tokens.output_tokens);
        const jobResult = await jobRepository.markCompleted(dbClient, job_id, attempt.data.received_data, fullPrice);
        if (jobResult === null)
            throw Error("Complete job operation failed at mark job completed");
        await eventRepository.createAttemptCompletedEvent(dbClient, attempt_id);
        await eventRepository.createJobCompletedEvent(dbClient, job_id);
        await dbClient.query("COMMIT");
    }
    catch (error) {
        await dbClient.query("ROLLBACK");
        throw error;
    }
    return;
}
export default {
    createJob,
    completeJob,
};
