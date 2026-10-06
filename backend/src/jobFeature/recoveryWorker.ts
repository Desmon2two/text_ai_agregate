import { Client } from "pg";
import recoveryRepository from "./recoveryRepository";

async function claimRecovery(dbClient: Client, recoveryWorkerId: string, attemptId: string, leasedUntil: Date){
   const result =  recoveryRepository.claimRecovery(dbClient, attemptId, recoveryWorkerId, leasedUntil);
    return result
}
export default {
    claimRecovery
}