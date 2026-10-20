import { Client } from "pg";
declare function createJobAcceptedEvent(dbClient: Client, jobId: string): Promise<any>;
declare function createJobProcessingEvent(dbClient: Client, jobId: string): Promise<any>;
declare function createJobProcessedFromIntermediateStateEvent(dbClient: Client, jobId: string): Promise<any>;
declare function createWorkerStartedEvent(dbClient: Client, jobId: string): Promise<any>;
declare function createAttemptCreatedEvent(dbClient: Client, attemptId: string, metadata: {
    origin: string;
}): Promise<any>;
declare function createSendingRequestEvent(dbClient: Client, attemptId: string): Promise<any>;
declare function createWaitingForResponseEvent(dbClient: Client, attemptId: string, metadata: {
    providerJobId: string;
}): Promise<any>;
declare function createResponseReceivedEvent(dbClient: Client, attemptId: string): Promise<any>;
declare function createResponseValidatedEvent(dbClient: Client, attemptId: string): Promise<any>;
declare function createAttemptCompletedEvent(dbClient: Client, attemptId: string): Promise<any>;
declare function createJobCompletedEvent(dbClient: Client, jobId: string): Promise<any>;
declare function createAttemptFailedEvent(dbClient: Client, attemptId: string, metadata: {
    error: unknown;
}): Promise<any>;
declare function createJobFailedEvent(dbClient: Client, jobId: string, metadata: {
    error: unknown;
}): Promise<any>;
declare function createRetryCreatedEvent(dbClient: Client, jobId: string, attemptId: string, metadata: {
    previousAttemptId: string;
}): Promise<any>;
declare function createRecoveryStartedEvent(dbClient: Client, jobId: string, metadata: {
    reason: string;
}, attemptId?: string): Promise<any>;
declare function createRecoveryAbandonedEvent(dbClient: Client, jobId: string, metadata: {
    reason: string;
}, attemptId?: string): Promise<any>;
declare function createRecoveryCompletedEvent(dbClient: Client, jobId: string, metadata: {
    reason: string;
}, attemptId?: string): Promise<any>;
declare function deleteEvent(dbClient: Client, eventId: string, metadata: {
    reason: string;
}): Promise<number | null>;
declare const _default: {
    createJobAcceptedEvent: typeof createJobAcceptedEvent;
    createJobProcessingEvent: typeof createJobProcessingEvent;
    createJobProcessedFromIntermediateStateEvent: typeof createJobProcessedFromIntermediateStateEvent;
    createWorkerStartedEvent: typeof createWorkerStartedEvent;
    createAttemptCreatedEvent: typeof createAttemptCreatedEvent;
    createSendingRequestEvent: typeof createSendingRequestEvent;
    createWaitingForResponseEvent: typeof createWaitingForResponseEvent;
    createResponseReceivedEvent: typeof createResponseReceivedEvent;
    createResponseValidatedEvent: typeof createResponseValidatedEvent;
    createAttemptCompletedEvent: typeof createAttemptCompletedEvent;
    createJobCompletedEvent: typeof createJobCompletedEvent;
    createAttemptFailedEvent: typeof createAttemptFailedEvent;
    createJobFailedEvent: typeof createJobFailedEvent;
    createRetryCreatedEvent: typeof createRetryCreatedEvent;
    createRecoveryStartedEvent: typeof createRecoveryStartedEvent;
    createRecoveryAbandonedEvent: typeof createRecoveryAbandonedEvent;
    createRecoveryCompletedEvent: typeof createRecoveryCompletedEvent;
    deleteEvent: typeof deleteEvent;
};
export default _default;
//# sourceMappingURL=eventRepository.d.ts.map