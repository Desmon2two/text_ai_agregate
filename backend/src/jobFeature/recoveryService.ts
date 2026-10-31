import type { Client } from "pg";
import recoveryRepository from "./recoveryRepository.js";
import jobService from "./jobService.js";
import handleFailure from "../infrastructure/failureHandler.js";
import eventRepository from "./eventRepository.js";
import {worker} from "../queue/worker.js";
import jobUseCase from "./jobUseCase.js";

async function recoverAttempts(dbClient: Client, recovery_worker_id: string) {
  const recoverableAttempts =
    await recoveryRepository.scanAttemptsForRecovery(dbClient);
  if (recoverableAttempts === null) return null;

  for (let index = 0; index < recoverableAttempts.length; index++) {
    const attempt = recoverableAttempts[index];
    await dbClient.query("BEGIN");
    const claimedAttempt = await recoveryRepository.claimAttemptForRecovery(
      dbClient,
      attempt.attempt_id,
      recovery_worker_id,
      new Date(Date.now() + 5000),
    );

    if (claimedAttempt === null) {
      await dbClient.query("ROLLBACK");
      continue;
    }
    await dbClient.query("COMMIT");

    try {
      if (
        claimedAttempt.state === "SENDING" 
        // || claimedAttempt.state === "WAITING"
      ) {
        await eventRepository.createRecoveryStartedEvent(
          dbClient,
          claimedAttempt.attempt_id,
          { reason: "Timed out attempt state" },
        );
        await handleFailure(dbClient, claimedAttempt.attempt_id, {
          message: "Timed out by recovery",
          retryable: false,
        });
        await eventRepository.createRecoveryCompletedEvent(
          dbClient,
          claimedAttempt.attempt_id,
          {
            reason:
              "Attempt + job critically failed according to recovery ambiguity policy",
          },
        );
      }
      if (claimedAttempt.state === "VALIDATED") {
        const {input_tokens , output_tokens} = claimedAttempt.data?.tokens
        const {validated_data} = claimedAttempt.data?
        await eventRepository.createRecoveryStartedEvent(
          dbClient,
          claimedAttempt.attempt_id,
          { reason: "Stale attempt state" },
        );
        await jobUseCase.completeJob(
          dbClient,
          claimedAttempt.job_id,
          claimedAttempt.attempt_id,
          {tokens: {input_tokens, output_tokens}, validated_data }
        );
        await eventRepository.createRecoveryCompletedEvent(
          dbClient,
          claimedAttempt.attempt_id,
          { reason: "Manually completed the attempt" },
        );
      }
      if (claimedAttempt.state === "CREATED") {
        await eventRepository.createRecoveryStartedEvent(
          dbClient,
          claimedAttempt.attempt_id,
          { reason: "Stale attempt state" },
        );
        await worker.processJobFromIntermediateState(
          dbClient,
          claimedAttempt.job_id,
        );
        await eventRepository.createRecoveryCompletedEvent(
          dbClient,
          claimedAttempt.attempt_id,
          { reason: "?" },
        );
      }
    } catch (error) {
      await eventRepository.createRecoveryAbandonedEvent(
        dbClient,
        claimedAttempt.attempt_id,
        { reason: "Error during attempt recovery" },
      );
    } finally {
      await recoveryRepository.releaseAttemptRecovery(
        dbClient,
        attempt.attempt_id,
        recovery_worker_id,
      );
    }
  }
}
async function recoverJobs(dbClient: Client, recovery_worker_id: string) {
  const recoverableJobs =
    await recoveryRepository.scanJobsForRecovery(dbClient);
  if (recoverableJobs === null) {
    return null;
  }
  for (let index = 0; index < recoverableJobs.length; index++) {
    const job = recoverableJobs[index];
    await dbClient.query("BEGIN");
    const claimedJob = await recoveryRepository.claimJobForRecovery(
      dbClient,
      job.job_id,
      recovery_worker_id,
      new Date(Date.now() + 5000),
    );
    if (claimedJob === null) {
      await dbClient.query("ROLLBACK");
      continue;
    }
    await dbClient.query("COMMIT");
    try {
      if (claimedJob.state === "QUEUED") {
        await eventRepository.createRecoveryStartedEvent(
          dbClient,
          claimedJob.job_id,
          { reason: "Stale job state" },
        );
        await queueService.requeue(dbClient, claimedJob.job_id);
        await eventRepository.createRecoveryCompletedEvent(
          dbClient,
          claimedJob.job_id,
          { reason: "Requeued job" },
        );
      }
      if (claimedJob.state === "ACCEPTED") {
        await eventRepository.createRecoveryStartedEvent(
          dbClient,
          claimedJob.job_id,
          { reason: "Stale job state" },
        );
        await worker.processJobFromIntermediateState(
          dbClient,
          claimedJob.job_id,
        );
        await eventRepository.createRecoveryCompletedEvent(
          dbClient,
          claimedJob.job_id,
          { reason: "Requeued job" },
        );
      }
    } catch (error) {
      await eventRepository.createRecoveryAbandonedEvent(
        dbClient,
        claimedJob.job_id,
        { reason: "Error during job recovery" },
      );
    } finally {
      await recoveryRepository.releaseJobRecovery(
        dbClient,
        claimedJob.job_id,
        recovery_worker_id,
      );
    }
  }
}
export default {
  recoverAttempts,
  recoverJobs,
};
