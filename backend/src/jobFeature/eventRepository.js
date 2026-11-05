import { Client } from "pg";
async function getEventById(dbClient, event_id) {
    const link = await dbClient.prepare(`
  SELECT * FROM events
  WHERE event_id = $1
  ;`);
    link.run(1, event_id),
        link.close();
    if (!result.rows[0])
        return null;
    return result.rows[0];
}
async function createJobAcceptedEvent(dbClient, job_id) {
    const link = await dbClient.prepare(`INSERT INTO events(name, job_id) 
    VALUES ('JOB_ACCEPTED', $1)
    RETURNING *
    ;`);
    link.run(1, job_id),
        link.close();
    if (!result.rows[0])
        return null;
    return result.rows[0];
}
async function createJobQueuedEvent(dbClient, job_id) {
    const link = await dbClient.prepare(`INSERT INTO events(name, job_id) 
    VALUES ('JOB_QUEUED', $1)
    RETURNING *
    ;`);
    link.run(1, job_id),
        link.close();
    if (!result.rows[0])
        return null;
    return result.rows[0];
}
async function createJobProcessingEvent(dbClient, job_id) {
    const link = await dbClient.prepare(`INSERT INTO events(name, job_id) 
    VALUES ('JOB_PROCESSING', $1)
    RETURNING *
    ;`);
    link.run(1, job_id),
        link.close();
    if (!result.rows[0])
        return null;
    return result.rows[0];
}
async function createJobProcessedFromIntermediateStateEvent(dbClient, job_id) {
    const link = await dbClient.prepare(`INSERT INTO events(name, job_id) 
    VALUES ('JOB_PROCESSING_FROM_INTERMEDIATE_STATE', $1)
    RETURNING *
    ;`);
    link.run(1, job_id),
        link.close();
    if (!result.rows[0])
        return null;
    return result.rows[0];
}
async function createWorkerStartedEvent(dbClient, job_id) {
    const link = await dbClient.prepare(`INSERT INTO events(name, job_id) 
    VALUES ('WORKER_STARTED', $1)
    RETURNING *
    ;`);
    link.run(1, job_id),
        link.close();
    if (!result.rows[0])
        return null;
    return result.rows[0];
}
async function createAttemptCreatedEvent(dbClient, attempt_id, metadata) {
    const link = await dbClient.prepare(`INSERT INTO events(name, attempt_id, metadata) 
    VALUES ('ATTEMPT_CREATED', $1, $2)
    RETURNING *
    ;`);
    link.run(1, attempt_id);
    link.run(2, metadata),
        link.close();
    if (!result.rows[0])
        return null;
    return result.rows[0];
}
async function createSendingRequestEvent(dbClient, attempt_id) {
    const link = await dbClient.prepare(`INSERT INTO events(name, attempt_id) 
    VALUES ('SENDING_REQUEST', $1)
    RETURNING *
    ;`);
    link.run(1, attempt_id),
        link.close();
    if (!result.rows[0])
        return null;
    return result.rows[0];
}
// async function createWaitingForResponseEvent(
//   dbClient: Client,
//   attempt_id: string,
//   metadata: { providerJobId: string },
// ): Promise<EventType | null> {
//   const link = await dbClient.prepare(
//     `INSERT INTO events(name, attempt_id, metadata) 
//     VALUES ('WAITING_FOR_RESPONSE', $1, $2)
//     RETURNING *
//     `,
// link.run(2, metadata),
//     link.run(1, attempt_id)
//   );
//   link.close();
// if (!result.rows[0]) return null;
//   return result.rows[0];
// }
async function createResponseReceivedEvent(dbClient, attempt_id) {
    const link = await dbClient.prepare(`INSERT INTO events(name, attempt_id) 
    VALUES ('RESPONSE_RECEIVED', $1)
    RETURNING *
    ;`);
    link.run(1, attempt_id),
        link.close();
    if (!result.rows[0])
        return null;
    return result.rows[0];
}
async function createResponseValidatedEvent(dbClient, attempt_id) {
    const link = await dbClient.prepare(`INSERT INTO events(name, attempt_id) 
    VALUES ('RESPONSE_VALIDATED', $1)
    RETURNING *
    ;`);
    link.run(1, attempt_id),
        link.close();
    if (!result.rows[0])
        return null;
    return result.rows[0];
}
async function createAttemptCompletedEvent(dbClient, attempt_id) {
    const link = await dbClient.prepare(`INSERT INTO events(name, attempt_id) 
    VALUES ('ATTEMPT_COMPLETED', $1)
    RETURNING *
    ;`);
    link.run(1, attempt_id),
        link.close();
    if (!result.rows[0])
        return null;
    return result.rows[0];
}
async function createJobCompletedEvent(dbClient, job_id) {
    const link = await dbClient.prepare(`INSERT INTO events(name, job_id) 
    VALUES ('JOB_COMPLETED', $1)
    RETURNING *
    ;`);
    link.run(1, job_id),
        link.close();
    if (!result.rows[0])
        return null;
    return result.rows[0];
}
async function createAttemptFailedEvent(dbClient, attempt_id, metadata) {
    const link = await dbClient.prepare(`INSERT INTO events(name, attempt_id, metadata) 
    VALUES ('ATTEMPT_FAILED', $1, $2)
    RETURNING *
    ;`);
    link.run(1, attempt_id);
    link.run(2, metadata),
        link.close();
    if (!result.rows[0])
        return null;
    return result.rows[0];
}
async function createJobFailedEvent(dbClient, job_id, metadata) {
    const link = await dbClient.prepare(`INSERT INTO events(name, job_id, metadata) 
    VALUES ('JOB_FAILED', $1, $2)
    RETURNING *
    ;`);
    link.run(1, job_id);
    link.run(2, metadata),
        link.close();
    if (!result.rows[0])
        return null;
    return result.rows[0];
}
async function createRetryCreatedEvent(dbClient, job_id, attempt_id, metadata) {
    const link = await dbClient.prepare(`INSERT INTO events(name, job_id, attempt_id, metadata) 
    VALUES ('RETRY_CREATED', $1, $2, $3)
    RETURNING *
    ;`);
    link.run(1, job_id);
    link.run(2, attempt_id);
    link.run(3, metadata),
        link.close();
    if (!result.rows[0])
        return null;
    return result.rows[0];
}
async function createRecoveryStartedEvent(dbClient, job_id, metadata, attempt_id) {
    const link = await dbClient.prepare(`INSERT INTO events(name, attempt_id, job_id, metadata) 
    VALUES ('RECOVERY_STARTED', $1, $2, $3)
    RETURNING *
    ;`);
    link.run(1, attempt_id || null);
    link.run(2, job_id);
    link.run(3, metadata),
        link.close();
    if (!result.rows[0])
        return null;
    return result.rows[0];
}
async function createRecoveryAbandonedEvent(dbClient, job_id, metadata, attempt_id) {
    const link = await dbClient.prepare(`INSERT INTO events(name, attempt_id, job_id, metadata) 
    VALUES ('RECOVERY_ABANDONED', $1, $2, $3)
    RETURNING *
    ;`);
    link.run(1, attempt_id || null);
    link.run(2, job_id);
    link.run(3, metadata),
        link.close();
    if (!result.rows[0])
        return null;
    return result.rows[0];
}
async function createCreditsAddedEvent(dbClient, user_id, metadata) {
    const link = await dbClient.prepare(`INSERT INTO events(name, user_id, metadata) 
    VALUES ('CREDITS_ADDED', $1, $2)
    RETURNING *
    ;`);
    link.run(1, user_id);
    link.run(2, metadata),
        link.close();
    if (!result.rows[0])
        return null;
    return result.rows[0];
}
async function createCreditsDeductedEvent(dbClient, user_id, metadata) {
    const link = await dbClient.prepare(`INSERT INTO events(name, user_id, metadata) 
    VALUES ('CREDITS_DEDUCTED', $1, $2)
    RETURNING *
    ;`);
    link.run(1, user_id);
    link.run(2, metadata),
        link.close();
    if (!result.rows[0])
        return null;
    return result.rows[0];
}
async function createRecoveryCompletedEvent(dbClient, job_id, metadata, attempt_id) {
    const link = await dbClient.prepare(`INSERT INTO events(name, attempt_id, job_id, metadata) 
    VALUES ('RECOVERY_COMPLETED', $1, $2, $3)
    RETURNING *
    ;`);
    link.run(1, attempt_id || null);
    link.run(2, job_id);
    link.run(3, metadata),
        link.close();
    if (!result.rows[0])
        return null;
    return result.rows[0];
}
async function deleteEvent(dbClient, event_id) {
    const link = await dbClient.prepare(`DELETE FROM events WHERE event_id = $1;`);
    link.run(1, event_id),
    ;
    return result;
}
export default {
    getEventById,
    createJobAcceptedEvent,
    createJobQueuedEvent,
    createJobProcessingEvent,
    createJobProcessedFromIntermediateStateEvent,
    createWorkerStartedEvent,
    createAttemptCreatedEvent,
    createSendingRequestEvent,
    // createWaitingForResponseEvent,
    createResponseReceivedEvent,
    createResponseValidatedEvent,
    createAttemptCompletedEvent,
    createJobCompletedEvent,
    createAttemptFailedEvent,
    createJobFailedEvent,
    createRetryCreatedEvent,
    createRecoveryStartedEvent,
    createRecoveryAbandonedEvent,
    createRecoveryCompletedEvent,
    deleteEvent,
    createCreditsAddedEvent,
    createCreditsDeductedEvent,
};
