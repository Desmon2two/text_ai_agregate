import { Client } from "pg";
import { CreateJob, Job } from "./types/JobTypes";
import { Attempt } from "./types/AttemptTypes";
declare function getJob(dbClient: Client, jobId: string): Promise<Job | null>;
declare function getAttemptsPerJob(dbClient: Client, jobId: string): Promise<Attempt[] | null>;
declare function createJob({ dbClient, type, body, userId, estimatedCost, }: CreateJob): Promise<Job>;
declare function markAccepted(dbClient: Client, jobId: string): Promise<any>;
declare function markQueued(dbClient: Client, jobId: string): Promise<any>;
declare function markProcessing(dbClient: Client, jobId: string): Promise<any>;
declare function markCompleted(dbClient: Client, jobId: string, data: unknown, actualCost: number): Promise<any>;
declare function markFailed(dbClient: Client, jobId: string, error: unknown): Promise<any>;
declare const _default: {
    getJob: typeof getJob;
    getAttemptsPerJob: typeof getAttemptsPerJob;
    createJob: typeof createJob;
    markAccepted: typeof markAccepted;
    markQueued: typeof markQueued;
    markProcessing: typeof markProcessing;
    markCompleted: typeof markCompleted;
    markFailed: typeof markFailed;
};
export default _default;
//# sourceMappingURL=jobRepository.d.ts.map