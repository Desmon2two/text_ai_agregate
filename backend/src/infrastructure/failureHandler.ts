import type { Client } from "pg";
import {
  ForbiddenError,
  NotFoundError,
  type AttemptError,
} from "../errors/applicationErrors.js";
import attemptService from "../jobFeature/attemptService.js";
import { nonSecretVariables } from "../infrastructure/utils/nonSecretVariables.js";
import attemptRepository from "../jobFeature/attemptRepository.js";
import jobRepository from "../jobFeature/jobRepository.js";
import eventRepository from "../jobFeature/eventRepository.js";
import queueService from "../queue/queueService.js";

export default async function handleFailure(
  dbClient: Client,
  attempt_id: string,
  error: AttemptError,
): Promise<string | null> {
  try {
    await dbClient.query("BEGIN");
    const attempt = await attemptRepository.getAttemptById(
      dbClient,
      attempt_id,
    );
    if (attempt === null) throw new NotFoundError("No such attempt");
    if (attempt.state === "COMPLETED" || attempt.state === "FAILED") {
      throw new ForbiddenError(
        "Can't process attempt in state 'COMPLETED' OR 'FAILED'",
      );
    }
    await attemptRepository.markFailed(dbClient, attempt.attempt_id, error);
    await eventRepository.createAttemptFailedEvent(
      dbClient,
      attempt.attempt_id,
      { error },
    );

    if (!error.retryable) {
      await jobRepository.markFailed(dbClient, attempt.job_id, error);
      await eventRepository.createJobFailedEvent(dbClient, attempt.job_id, {
        error: "NOT_RETRYABLE",
      });
      throw new Error("Recovery failed. Reason: Attempt not retryable");
    }

    if (attempt.attempt_number >= nonSecretVariables.MAX_ATTEMPTS) {
      await jobRepository.markFailed(dbClient, attempt.job_id, error);
      await eventRepository.createJobFailedEvent(dbClient, attempt.job_id, {
        error: "MAX_ATTEMPTS_REACHED",
      });
      throw new Error("Recovery failed. Reason: Max attempts reached");
    }

    const newAttempt = await attemptService.createAttempt(
      dbClient,
      attempt.job_id,
      attempt.provider,
      attempt.model,
    );
    await eventRepository.createRetryCreatedEvent(
      dbClient,
      attempt.job_id,
      newAttempt.attempt_id,
      {
        previousAttemptId: attempt.attempt_id,
      },
    );
    await dbClient.query("COMMIT");
    await queueService.addJobToRecoveryQueue({
      job_id: newAttempt.job_id,
      attempt_id: newAttempt.attempt_id,
    });
    return newAttempt.attempt_id;
  } catch (error) {
    await dbClient.query("ROLLBACK");
    throw error;
  }
}
