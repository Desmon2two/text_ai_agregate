import { Client } from "pg";
import { Attempt } from "./types/AttemptTypes";
import { Job } from "./types/JobTypes";
declare function scanAttemptsForRecovery(dbClient: Client): Promise<Attempt[] | null>;
declare function scanJobsForRecovery(dbClient: Client): Promise<Job[] | null>;
declare function claimAttemptForRecovery(dbClient: Client, attemptId: string, recoveryWorkerId: string, leaseUntil: Date): Promise<Attempt | null>;
declare function claimJobForRecovery(dbClient: Client, jobId: string, recoveryWorkerId: string, recoveryLeaseUntil: Date): Promise<Job | null>;
declare function releaseAttemptRecovery(dbClient: Client, attemptId: string, recoveryWorkerId: string): Promise<any>;
declare function releaseJobRecovery(dbClient: Client, jobId: string, recoveryWorkerId: string): Promise<any>;
declare const _default: {
    scanAttemptsForRecovery: typeof scanAttemptsForRecovery;
    scanJobsForRecovery: typeof scanJobsForRecovery;
    claimAttemptForRecovery: typeof claimAttemptForRecovery;
    releaseAttemptRecovery: typeof releaseAttemptRecovery;
    claimJobForRecovery: typeof claimJobForRecovery;
    releaseJobRecovery: typeof releaseJobRecovery;
};
export default _default;
//# sourceMappingURL=recoveryRepository.d.ts.map