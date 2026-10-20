import { Client } from "pg";
import type { JobStateTypes } from "./JobStateType";
type Job = {
    userId: string;
    jobId: string;
    state: JobStateTypes;
    type: string;
    body: unknown;
    files?: string[];
    error?: unknown;
    data?: unknown;
    metadata?: unknown;
    recoveryWorkerId?: string;
    recoveryLeaseUntil?: Date;
    estimatedCost: number;
    actualCost?: number;
    createdAt: Date;
};
type CreateJob = {
    dbClient: Client;
    userId: string;
    type: string;
    body: unknown;
    estimatedCost: number;
};
type CommitJobOutput = {
    jobId: string;
    createdAt: Date;
};
type completeJobType = {
    dbClient: Client;
    jobId: string;
    attemptId: string;
};
export { Job, CreateJob, CommitJobOutput, completeJobType };
//# sourceMappingURL=JobTypes.d.ts.map