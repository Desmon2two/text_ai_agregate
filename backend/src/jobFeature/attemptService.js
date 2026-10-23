import jobRepository from "./jobRepository.js";
import attemptRepository from "./attemptRepository.js";
import { nonSecretVariables } from "../infrastructure/utils/nonSecretVariables.js";
import eventRepository from "./eventRepository.js";
async function createAttempt(dbClient, job_id, provider, model) {
    await dbClient.query("BEGIN");
    try {
        const attempts = await jobRepository.getAttemptsPerJob(dbClient, jobId);
        if (attempts === null)
            throw new Error("No attempts");
        const attemptNumber = attempts[0].attempt_number;
        if (attemptNumber >= nonSecretVariables.getMaxAttempts()) {
            throw new Error("Too many attempts for this job");
        }
        const attempt = await attemptRepository.createAttempt({
            dbClient,
            job_id,
            attempt_number: attemptNumber + 1,
            provider,
            model,
        });
        if (attempt === null)
            throw new Error("Attempt was not created");
        await dbClient.query("COMMIT");
        return attempt;
    }
    catch (error) {
        await dbClient.query("ROLLBACK");
        throw error;
    }
}
async function completeAttempt(dbClient, attempt_id, data) {
    const attempt = await attemptRepository.getAttempt(dbClient, attempt_id);
    if (!attempt)
        throw new Error("Attempt not found");
    if (attempt.state !== "VALIDATED")
        throw new Error("Attempt not in validated state, unable to complete");
    await dbClient.query("BEGIN");
    try {
        await attemptRepository.markCompleted(dbClient, attempt_id, data);
        await eventRepository.createAttemptCompletedEvent(dbClient, attempt_id);
        await dbClient.query("COMMIT");
    }
    catch (error) {
        await dbClient.query("ROLLBACK");
        throw error;
    }
}
async function failAttempt(dbClient, attempt_id, error) {
    const failedAttempt = await attemptRepository.getAttempt(dbClient, attempt_id);
    if (!failedAttempt)
        throw new Error("Attempt not found");
    if (failedAttempt.state === "COMPLETED")
        throw new Error("Attempt in completed state, unable to fail");
    await dbClient.query("BEGIN");
    try {
        await attemptRepository.markFailed(dbClient, attempt_id, error);
        await eventRepository.createAttemptFailedEvent(dbClient, attempt_id, {
            error: error,
        });
        await dbClient.query("COMMIT");
    }
    catch (error) {
        await dbClient.query("ROLLBACK");
        throw error;
    }
}
export default {
    createAttempt,
    completeAttempt,
    failAttempt,
};
