import { Client } from "pg";
import recoveryRepository from "../jobFeature/recoveryRepository.js";

async function claimRecovery(
  dbClient: Client,
  recoveryWorkerId: string,
  attempt_id: string,
  leasedUntil: Date,
) {
  const result = recoveryRepository.claimAttemptForRecovery(
    dbClient,
    attempt_id,
    recoveryWorkerId,
    leasedUntil,
  );
  if (result === null) throw new Error("Attempt was not claimed for recovery");
  return result;
}
export default {
  claimRecovery,
};
