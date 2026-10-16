import { Client } from "pg";
declare function claimRecovery(dbClient: Client, recoveryWorkerId: string, attemptId: string, leasedUntil: Date): Promise<any>;
declare const _default: {
    claimRecovery: typeof claimRecovery;
};
export default _default;
//# sourceMappingURL=recoveryWorker.d.ts.map