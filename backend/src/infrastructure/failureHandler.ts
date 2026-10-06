import { Client } from "pg";
import { AttemptError } from "../errors/AttemptErrorType";
import attemptService from "../jobFeature/attemptService";
import nonSecretVariables from "../infrastructure/utils/nonSecretVariables";
import attemptRepository from "../jobFeature/attemptRepository";
import jobRepository from "../jobFeature/jobRepository";
import eventRepository from "../jobFeature/eventRepository";

export default async function handleFailure(
  dbClient: Client,
  attemptId: string,
  error: AttemptError,
): Promise<string | null> {
  try {
    await dbClient.query("BEGIN");
    const attempt = await attemptRepository.getAttempt(dbClient, attemptId);
    if (attempt === null) return null;
    if (attempt.state === "COMPLETED" || attempt.state === "FAILED") {
      return null;
    }
    await attemptRepository.markFailed(dbClient, attempt.attemptId, error);
    await eventRepository.createAttemptFailedEvent(
      dbClient,
      attempt.attemptId,
      { error },
    );

    if (!error.retryable) {
      await jobRepository.markFailed(dbClient, attempt.jobId, error);
      await eventRepository.createJobFailedEvent(dbClient, attempt.jobId, {
        error: "NOT_RETRYABLE",
      });
      throw new Error("Not retryable");
    }

    if (attempt.attemptNumber >= nonSecretVariables.MAX_ATTEMPTS) {
      await jobRepository.markFailed(dbClient, attempt.jobId, error);
      await eventRepository.createJobFailedEvent(dbClient, attempt.jobId, {
        error: "MAX_ATTEMPTS_REACHED",
      });
      throw new Error("Max attempts reached");
    }

    const newAttempt = await attemptService.createAttempt({
      dbClient,
      jobId: attempt.jobId,
      provider: attempt.provider,
      model: attempt.model,
    });
    await eventRepository.createRetryCreatedEvent(
      dbClient,
      attempt.jobId,
      newAttempt.attemptId,
      {
        previousAttemptId: attempt.attemptId,
      },
    );
    await dbClient.query("COMMIT");
    return newAttempt.attemptId;
  } catch (error) {
    await dbClient.query("ROLLBACK");
    throw error;
  }
}
