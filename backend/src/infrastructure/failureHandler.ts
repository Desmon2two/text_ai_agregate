import { dbClient } from "../database/dbClient";
import { AttemptError } from "../errors/AttemptErrorType";
import attemptService from "../jobFeature/attemptService";
import { Attempt } from "../jobFeature/types/AttemptTypes";

export default async function handleFailure(
  dbClient,
  attempt: Attempt,
  error: AttemptError,
): Promise<string | null> {
  await dbClient.query("BEGIN");
  try {
    await attemptRepository.markFailed(dbClient, attempt.attemptId, error);
    if (!error.retryable) {
      await jobRepository.markFailed(dbClient, attempt.jobId);
      await dbClient.query("COMMIT");
      await ;
      return null;
    }
    if (attempt.attemptNumber >= process.env.MAX_ATTEMPTS) {
      await jobRepository.markFailed(dbClient, attempt.jobId);
      await eventRepository.createEvent({
        dbClient,
        name: "ATTEMPT_FAILED",
        reason: "MAX_ATTEMPTS_REACHED",
      });
      await eventRepository.createEvent({
        dbClient,
        name: "JOB_FAILED",
        reason: "MAX_ATTEMPTS_REACHED",
      });
      await dbClient.query("COMMIT");
      await ;
      return null;
    }
    const newAttempt = await attemptService.createAttempt({
      dbClient,
      jobId: attempt.jobId,
      provider: attempt.provider,
      model: attempt.model,
    });
    await eventRepository.createEvent({
      dbClient,
      name: "RETRY_CREATED",
      metadata: {
        attemptId: newAttempt.attemptId,
        previousAttemptId: attempt.attemptId,
      },
    });
    await dbClient.query("COMMIT");
    return newAttempt.attemptId;
  } catch (error) {
    await dbClient.query("ROLLBACK");
    throw error;
  }
}
