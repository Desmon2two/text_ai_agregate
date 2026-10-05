import { Client } from "pg";
import recoveryRepository from "./recoveryRepository";
import attemptRepository from "./attemptRepository";
import handleFailure from "../infrastructure/failureHandler";
import recoveryWorker from "./recoveryWorker";

async function recover(dbClient: Client, attemptId: string, state: string, providerOperationId: string | null) {
    const recoverableAttempts =
      await recoveryRepository.scanForRecovery(dbClient);
    if (recoverableAttempts.length === 0) return null;
    dbClient.query("BEGIN")
    await recoveryWorker.claimRecovery()
    try {
      if (state === "SENDING" && providerOperationId === null) {
        // recoveryRepository.claimRecovery(
        //   dbClient,
        //   attemptId,
        //   recoveryWorkerId,
        //   new Date,
        // );
        await handleFailure(dbClient, attemptId, {
          message: "Timed out by recovery",
          retryable: false,
        });
      }
      if (state === "SENDING" && providerOperationId !== null) {
        // recoveryRepository.claimRecovery(
        //   dbClient,
        //   attemptId,
        //   recoveryWorkerId,
        //   Date.now() + 300000,
        // );
        const result = await providerService.reconcile(
          dbClient,
          attemptId,
          jobProviderId,
        );
        if (result === null) {
          await handleFailure(dbClient, attemptId, {
            message: "Timed out by recovery",
            retryable: false,
          });
        }
      }
      if (state === "VALIDATED") {
        // recoveryRepository.claimRecovery(
        //   dbClient,
        //   attemptId,
        //   recoveryWorkerId,
        //   Date.now() + 5000,
        // );
        attemptRepository.markCompleted(
          dbClient,
          attemptId,
          data,
        );
      }
      if (state === "ACCEPTED") {
        // recoveryRepository.claimRecovery(
        //   dbClient,
        //   attemptId,
        //   recoveryWorkerId,
        //   Date.now() + 5000,
        // );
        await queueService.enqueue(dbClient, attemptId);
      }
      dbClient.query("COMMIT");
    } catch (error) {
      dbClient.query("ROLLBACK");
      throw error;
    }
  }
export default {
  recover,
};
