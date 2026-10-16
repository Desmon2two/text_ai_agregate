import { Client } from "pg";
declare function recoverAttempts(dbClient: Client, recoveryWorkerId: string): Promise<null | undefined>;
declare function recoverJobs(dbClient: Client, recoveryWorkerId: string): Promise<null | undefined>;
declare const _default: {
    recoverAttempts: typeof recoverAttempts;
    recoverJobs: typeof recoverJobs;
};
export default _default;
//# sourceMappingURL=recoveryService.d.ts.map