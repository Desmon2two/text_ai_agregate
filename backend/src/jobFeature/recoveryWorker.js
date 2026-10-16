import { Client } from "pg";
import recoveryRepository from "./recoveryRepository";
async function claimRecovery(dbClient, recoveryWorkerId, attemptId, leasedUntil) {
    const result = recoveryRepository.claimRecovery(dbClient, attemptId, recoveryWorkerId, leasedUntil);
    return result;
}
export default {
    claimRecovery
};
//# sourceMappingURL=recoveryWorker.js.map