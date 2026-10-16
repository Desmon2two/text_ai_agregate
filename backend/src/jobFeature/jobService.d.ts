import { CommitJobOutput } from "./types/JobTypes";
import { Client } from "pg";
declare function createJob(dbClient: Client, type: string, estimatedCost: number, userId: string, { provider, model }: {
    model: any;
    provider: any;
}, body: {
    prompt: string;
    [keys?: any]: any;
}, filesUrl?: string): Promise<CommitJobOutput>;
declare function planJob({ userid, jobTypeId, body, files }: {
    body: any;
    files: any;
    jobTypeId: any;
    userid: any;
}): Promise<{
    jobType: any;
    provider: any;
    model: any;
    estimatedCost: any;
    interpretedIntent: any;
    executionConfiguration: any;
}>;
declare function completeJob(dbClient: Client, jobId: string, attemptId: string): Promise<void>;
declare const _default: {
    createJob: typeof createJob;
    planJob: typeof planJob;
    completeJob: typeof completeJob;
};
export default _default;
//# sourceMappingURL=jobService.d.ts.map