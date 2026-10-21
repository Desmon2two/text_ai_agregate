import { Client } from "pg";
import recoveryRepository from "./recoveryRepository.js";
async function claimRecovery(dbClient, recoveryWorkerId, attemptId, leasedUntil) {
    const result = recoveryRepository.claimRecovery(dbClient, attemptId, recoveryWorkerId, leasedUntil);
    return result;
}
export default {
    claimRecovery
};
