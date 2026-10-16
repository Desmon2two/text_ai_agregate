import { Client } from "pg";
import { Attempt, CreateAttemptInput } from "./types/AttemptTypes";
import { AttemptError } from "../errors/AttemptErrorType";
declare function createAttempt({ dbClient, jobId, provider, model, }: CreateAttemptInput): Promise<Attempt>;
declare function completeAttempt(dbClient: Client, attemptId: string, data: unknown): Promise<void>;
declare function failAttempt(attemptId: string, error: AttemptError): Promise<void>;
declare const _default: {
    createAttempt: typeof createAttempt;
    completeAttempt: typeof completeAttempt;
    failAttempt: typeof failAttempt;
};
export default _default;
//# sourceMappingURL=attemptService.d.ts.map