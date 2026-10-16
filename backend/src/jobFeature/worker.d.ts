import { Client } from "pg";
declare function processJobFromBeginning(dbClient: Client, jobId: string): Promise<void>;
declare function processJobFromIntermediateState(dbClient: Client, jobId: string): Promise<void>;
declare function executeAttempt(dbClient: Client, attemptid: string): Promise<void>;
declare const _default: {
    processJobFromBeginning: typeof processJobFromBeginning;
    processJobFromIntermediateState: typeof processJobFromIntermediateState;
    executeAttempt: typeof executeAttempt;
};
export default _default;
//# sourceMappingURL=worker.d.ts.map