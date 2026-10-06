import { Client } from "pg";
import recoveryRepository from "./recoveryRepository";
import jobService from "./jobService";
import handleFailure from "../infrastructure/failureHandler";
import eventRepository from "./eventRepository";
import worker from "./worker";

async function recoverAttempts(dbClient: Client, recoveryWorkerId: string) {
  const recoverableAttempts =
    await recoveryRepository.scanAttemptsForRecovery(dbClient);

  if (recoverableAttempts === null) return null;

  for (let index = 0; index < recoverableAttempts.length; index++) {
    const attempt = recoverableAttempts[index];
    await dbClient.query("BEGIN");
    const claimedAttempt = await recoveryRepository.claimAttemptForRecovery(
      dbClient,
      attempt.attemptId,
      recoveryWorkerId,
      new Date(Date.now() + 5000),
    );

    if (claimedAttempt === null) {
      await dbClient.query("ROLLBACK");
      continue;
    }
    await dbClient.query("COMMIT");

    try {
      if (
        claimedAttempt.state === "SENDING" ||
        claimedAttempt.state === "WAITING"
      ) {
        await eventRepository.createRecoveryStartedEvent(
          dbClient,
          claimedAttempt.attemptId,
          { reason: "Timed out attempt state" },
        );
        await handleFailure(dbClient, claimedAttempt.attemptId, {
          message: "Timed out by recovery",
          retryable: false,
        });
        await eventRepository.createRecoveryCompletedEvent(
          dbClient,
          claimedAttempt.attemptId,
          {
            reason:
              "Attempt + job critically failed according to recovery ambiguity policy",
          },
        );
      }
      if (claimedAttempt.state === "VALIDATED") {
        await eventRepository.createRecoveryStartedEvent(
          dbClient,
          claimedAttempt.attemptId,
          { reason: "Stale attempt state" },
        );
        await jobService.completeJob(
          dbClient,
          claimedAttempt.attemptId,
          claimedAttempt.jobId,
        );
        await eventRepository.createRecoveryCompletedEvent(
          dbClient,
          claimedAttempt.attemptId,
          { reason: "Manually completed the attempt" },
        );
      }
      if (claimedAttempt.state === "CREATED") {
        await eventRepository.createRecoveryStartedEvent(
          dbClient,
          claimedAttempt.attemptId,
          { reason: "Stale attempt state" },
        );
        await worker.processJobFromIntermediateState(
          dbClient,
          claimedAttempt.jobId,
        );
        await eventRepository.createRecoveryCompletedEvent(
          dbClient,
          claimedAttempt.attemptId,
          { reason: "?" },
        );
      }
    } catch (error) {
      await eventRepository.createRecoveryAbandonedEvent(
        dbClient,
        claimedAttempt.attemptId,
        { reason: "Error during attempt recovery" },
      );
    } finally {
      await recoveryRepository.releaseAttemptRecovery(
        dbClient,
        attempt.attemptId,
        recoveryWorkerId,
      );
    }
  }
}
async function recoverJobs(dbClient: Client, recoveryWorkerId: string) {
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
      job.jobId,
      recoveryWorkerId,
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
          claimedJob.jobId,
          { reason: "Stale job state" },
        );
        await queueService.requeue(dbClient, claimedJob.jobId);
        await eventRepository.createRecoveryCompletedEvent(
          dbClient,
          claimedJob.jobId,
          { reason: "Requeued job" },
        );
      }
      if (claimedJob.state === "ACCEPTED") {
        await eventRepository.createRecoveryStartedEvent(
          dbClient,
          claimedJob.jobId,
          { reason: "Stale job state" },
        );
        await worker.processJobFromIntermediateState(
          dbClient,
          claimedJob.jobId,
        );
        await eventRepository.createRecoveryCompletedEvent(
          dbClient,
          claimedJob.jobId,
          { reason: "Requeued job" },
        );
      }
    } catch (error) {
      await eventRepository.createRecoveryAbandonedEvent(
        dbClient,
        claimedJob.jobId,
        { reason: "Error during job recovery" },
      );
    } finally {
      await recoveryRepository.releaseJobRecovery(
        dbClient,
        claimedJob.jobId,
        recoveryWorkerId,
      );
    }
  }
}
export default {
  recoverAttempts,
  recoverJobs,
};
