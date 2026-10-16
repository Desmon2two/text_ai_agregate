import { AttemptError } from "../errors/AttemptErrorType";
import { Attempt, CreateAttemptInput } from "./types/AttemptTypes";
import { Client } from "pg";
declare function getAttempt(dbClient: Client, attemptId: string): Promise<Attempt | null>;
declare function createAttempt({ dbClient, jobId, attemptNumber, provider, model, }: CreateAttemptInput): Promise<Attempt | null>;
declare function markSending(dbClient: Client, attemptId: string): Promise<any>;
declare function markWaiting(dbClient: Client, attemptId: string, providerJobId?: string): Promise<any>;
declare function markReceived(dbClient: Client, attemptId: string, data: unknown): Promise<any>;
declare function markValidated(dbClient: Client, attemptId: string, data: unknown): Promise<any>;
declare function markCompleted(dbClient: Client, attemptId: string, data: unknown): Promise<any>;
declare function markFailed(dbClient: Client, attemptId: string, error: AttemptError): Promise<any>;
declare const _default: {
    getAttempt: typeof getAttempt;
    createAttempt: typeof createAttempt;
    markSending: typeof markSending;
    markWaiting: typeof markWaiting;
    markReceived: typeof markReceived;
    markValidated: typeof markValidated;
    markCompleted: typeof markCompleted;
    markFailed: typeof markFailed;
};
export default _default;
//# sourceMappingURL=attemptRepository.d.ts.map