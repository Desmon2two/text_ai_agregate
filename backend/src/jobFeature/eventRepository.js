import { Client } from "pg";
import { EventType } from "./types/EventType";
async function getEventById(dbClient, event_id) {
    const result = await dbClient.query(`
  SELECT * FROM events
  WHERE event_id = $1
  `, [event_id]);
    if (!result.rows[0])
        return null;
    return result.rows[0];
}
async function createJobAcceptedEvent(dbClient, job_id) {
    const result = await dbClient.query(`INSERT INTO events(name, job_id) 
    VALUES ('JOB_ACCEPTED', $1)
    RETURNING *
    `, [job_id]);
    if (!result.rows[0])
        return null;
    return result.rows[0];
}
async function createJobProcessingEvent(dbClient, job_id) {
    const result = await dbClient.query(`INSERT INTO events(name, job_id) 
    VALUES ('JOB_PROCESSING', $1)
    RETURNING *
    `, [job_id]);
    if (!result.rows[0])
        return null;
    return result.rows[0];
}
async function createJobProcessedFromIntermediateStateEvent(dbClient, job_id) {
    const result = await dbClient.query(`INSERT INTO events(name, job_id) 
    VALUES ('JOB_PROCESSING_FROM_INTERMEDIATE_STATE', $1)
    RETURNING *
    `, [job_id]);
    if (!result.rows[0])
        return null;
    return result.rows[0];
}
async function createWorkerStartedEvent(dbClient, job_id) {
    const result = await dbClient.query(`INSERT INTO events(name, job_id) 
    VALUES ('WORKER_STARTED', $1)
    RETURNING *
    `, [job_id]);
    if (!result.rows[0])
        return null;
    return result.rows[0];
}
async function createAttemptCreatedEvent(dbClient, attempt_id, metadata) {
    const result = await dbClient.query(`INSERT INTO events(name, attempt_id, metadata) 
    VALUES ('ATTEMPT_CREATED', $1, $2)
    RETURNING *
    `, [attempt_id, metadata]);
    if (!result.rows[0])
        return null;
    return result.rows[0];
}
async function createSendingRequestEvent(dbClient, attempt_id) {
    const result = await dbClient.query(`INSERT INTO events(name, attempt_id) 
    VALUES ('SENDING_REQUEST', $1)
    RETURNING *
    `, [attempt_id]);
    if (!result.rows[0])
        return null;
    return result.rows[0];
}
async function createWaitingForResponseEvent(dbClient, attempt_id, metadata) {
    const result = await dbClient.query(`INSERT INTO events(name, attempt_id, metadata) 
    VALUES ('WAITING_FOR_RESPONSE', $1, $2)
    RETURNING *
    `, [attempt_id, metadata]);
    if (!result.rows[0])
        return null;
    return result.rows[0];
}
async function createResponseReceivedEvent(dbClient, attempt_id) {
    const result = await dbClient.query(`INSERT INTO events(name, attempt_id) 
    VALUES ('RESPONSE_RECEIVED', $1)
    RETURNING *
    `, [attempt_id]);
    if (!result.rows[0])
        return null;
    return result.rows[0];
}
async function createResponseValidatedEvent(dbClient, attempt_id) {
    const result = await dbClient.query(`INSERT INTO events(name, attempt_id) 
    VALUES ('RESPONSE_VALIDATED', $1)
    RETURNING *
    `, [attempt_id]);
    if (!result.rows[0])
        return null;
    return result.rows[0];
}
async function createAttemptCompletedEvent(dbClient, attempt_id) {
    const result = await dbClient.query(`INSERT INTO events(name, attempt_id) 
    VALUES ('ATTEMPT_COMPLETED', $1)
    RETURNING *
    `, [attempt_id]);
    if (!result.rows[0])
        return null;
    return result.rows[0];
}
async function createJobCompletedEvent(dbClient, job_id) {
    const result = await dbClient.query(`INSERT INTO events(name, job_id) 
    VALUES ('JOB_COMPLETED', $1)
    RETURNING *
    `, [job_id]);
    if (!result.rows[0])
        return null;
    return result.rows[0];
}
async function createAttemptFailedEvent(dbClient, attempt_id, metadata) {
    const result = await dbClient.query(`INSERT INTO events(name, attempt_id, metadata) 
    VALUES ('ATTEMPT_FAILED', $1, $2)
    RETURNING *
    `, [attempt_id, metadata]);
    if (!result.rows[0])
        return null;
    return result.rows[0];
}
async function createJobFailedEvent(dbClient, job_id, metadata) {
    const result = await dbClient.query(`INSERT INTO events(name, job_id, metadata) 
    VALUES ('JOB_FAILED', $1, $2)
    RETURNING *
    `, [job_id, metadata]);
    if (!result.rows[0])
        return null;
    return result.rows[0];
}
async function createRetryCreatedEvent(dbClient, job_id, attempt_id, metadata) {
    const result = await dbClient.query(`INSERT INTO events(name, job_id, attempt_id, metadata) 
    VALUES ('RETRY_CREATED', $1, $2, $3)
    RETURNING *
    `, [job_id, attempt_id, metadata]);
    if (!result.rows[0])
        return null;
    return result.rows[0];
}
async function createRecoveryStartedEvent(dbClient, job_id, metadata, attempt_id) {
    const result = await dbClient.query(`INSERT INTO events(name, attempt_id, job_id, metadata) 
    VALUES ('RECOVERY_STARTED', $1, $2, $3)
    RETURNING *
    `, [attempt_id || null, job_id, metadata]);
    if (!result.rows[0])
        return null;
    return result.rows[0];
}
async function createRecoveryAbandonedEvent(dbClient, job_id, metadata, attempt_id) {
    const result = await dbClient.query(`INSERT INTO events(name, attempt_id, job_id, metadata) 
    VALUES ('RECOVERY_ABANDONED', $1, $2, $3)
    RETURNING *
    `, [attempt_id || null, job_id, metadata]);
    if (!result.rows[0])
        return null;
    return result.rows[0];
}
async function createCreditsAddedEvent(dbClient, user_id, metadata) {
    const result = await dbClient.query(`INSERT INTO events(name, user_id, metadata) 
    VALUES ('CREDITS_ADDED', $1, $2)
    RETURNING *
    `, [user_id, metadata]);
    if (!result.rows[0])
        return null;
    return result.rows[0];
}
async function createCreditsDeductedEvent(dbClient, user_id, metadata) {
    const result = await dbClient.query(`INSERT INTO events(name, user_id, metadata) 
    VALUES ('CREDITS_DEDUCTED', $1, $2)
    RETURNING *
    `, [user_id, metadata]);
    if (!result.rows[0])
        return null;
    return result.rows[0];
}
async function createRecoveryCompletedEvent(dbClient, job_id, metadata, attempt_id) {
    const result = await dbClient.query(`INSERT INTO events(name, attempt_id, job_id, metadata) 
    VALUES ('RECOVERY_COMPLETED', $1, $2, $3)
    RETURNING *
    `, [attempt_id || null, job_id, metadata]);
    if (!result.rows[0])
        return null;
    return result.rows[0];
}
async function deleteEvent(dbClient, event_id) {
    const result = await dbClient.query(`DELETE FROM events WHERE event_id = $1`, [event_id]);
    return result;
}
export default {
    getEventById,
    createJobAcceptedEvent,
    createJobProcessingEvent,
    createJobProcessedFromIntermediateStateEvent,
    createWorkerStartedEvent,
    createAttemptCreatedEvent,
    createSendingRequestEvent,
    createWaitingForResponseEvent,
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
