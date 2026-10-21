import { Client } from "pg";
import { Attempt } from "./types/AttemptTypes.js";
import jobRepository from "./jobRepository.js";
import attemptRepository from "./attemptRepository.js";
import nonSecretVariables from "../infrastructure/utils/nonSecretVariables.js";
import eventRepository from "./eventRepository.js";
import { AttemptError } from "../errors/AttemptErrorType.js";
async function createAttempt(dbClient, jobId, provider, model) {
    await dbClient.query("BEGIN");
    try {
        let attempts = await jobRepository.getAttemptsPerJob(dbClient, jobId);
        if (attempts === null)
            throw new Error("Attempts null");
        const attemptNumber = attempts[0].attemptNumber;
        if (attemptNumber >= nonSecretVariables.getMaxAttempts()) {
            throw new Error("Too many attempts for this job");
        }
        const attempt = await attemptRepository.createAttempt({
            dbClient,
            jobId,
            attemptNumber: attemptNumber + 1,
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
async function completeAttempt(dbClient, attemptId, data) {
    try {
        await dbClient.query("BEGIN");
        await attemptRepository.markCompleted(dbClient, attemptId, data);
        await eventRepository.createAttemptCompletedEvent(dbClient, attemptId);
        await dbClient.query("COMMIT");
    }
    catch (error) {
        await dbClient.query("ROLLBACK");
        throw error;
    }
}
async function failAttempt(attemptId, error) {
    const failedAttempt = await attemptRepository.getAttempt(dbClient, attemptId);
    if (!failedAttempt)
        throw new Error("Attempt not found");
    await dbClient.query("BEGIN");
    try {
        await attemptRepository.markFailed(dbClient, attemptId, error);
        await eventRepository.createAttemptFailedEvent(dbClient, attemptId, { error: error });
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
