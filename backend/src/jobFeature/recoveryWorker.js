import { Client } from "pg";
import recoveryRepository from "./recoveryRepository.js";
async function claimRecovery(dbClient, recoveryWorkerId, attempt_id, leasedUntil) {
    const result = recoveryRepository.claimAttemptForRecovery(dbClient, attempt_id, recoveryWorkerId, leasedUntil);
    if (result === null)
        throw new Error("Attempt was not claimed for recovery");
    return result;
}
export default {
    claimRecovery
};
