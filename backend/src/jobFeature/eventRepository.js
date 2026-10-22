import { Client } from "pg";
async function getEventById(dbClient, event_id) {
    const res = await dbClient.query(`
  SELECT * FROM events
  WHERE event_id = $1
  `, [event_id]);
    return res.rows[0];
}
async function createJobAcceptedEvent(dbClient, job_id) {
    const result = await dbClient.query(`INSERT INTO events(name, job_id) 
    VALUES ('JOB_ACCEPTED', $1)
    RETURNING *
    `, [job_id]);
    return result.rows[0];
}
async function createJobProcessingEvent(dbClient, job_id) {
    const result = await dbClient.query(`INSERT INTO events(name, job_id) 
    VALUES ('JOB_PROCESSING', $1)
    RETURNING *
    `, [job_id]);
    return result.rows[0];
}
async function createJobProcessedFromIntermediateStateEvent(dbClient, job_id) {
    const result = await dbClient.query(`INSERT INTO events(name, job_id) 
    VALUES ('JOB_PROCESSING_FROM_INTERMEDIATE_STATE', $1)
    RETURNING *
    `, [job_id]);
    return result.rows[0];
}
async function createWorkerStartedEvent(dbClient, job_id) {
    const result = await dbClient.query(`INSERT INTO events(name, job_id) 
    VALUES ('WORKER_STARTED', $1)
    RETURNING *
    `, [job_id]);
    return result.rows[0];
}
async function createAttemptCreatedEvent(dbClient, attemptId, metadata) {
    const result = await dbClient.query(`INSERT INTO events(name, attempt_id, metadata) 
    VALUES ('ATTEMPT_CREATED', $1, $2)
    RETURNING *
    `, [attemptId, metadata]);
    return result.rows[0];
}
async function createSendingRequestEvent(dbClient, attemptId) {
    const result = await dbClient.query(`INSERT INTO events(name, attempt_id) 
    VALUES ('SENDING_REQUEST', $1)
    RETURNING *
    `, [attemptId]);
    return result.rows[0];
}
async function createWaitingForResponseEvent(dbClient, attemptId, metadata) {
    const result = await dbClient.query(`INSERT INTO events(name, attempt_id, metadata) 
    VALUES ('WAITING_FOR_RESPONSE', $1, $2)
    RETURNING *
    `, [attemptId, metadata]);
    return result.rows[0];
}
async function createResponseReceivedEvent(dbClient, attemptId) {
    const result = await dbClient.query(`INSERT INTO events(name, attempt_id) 
    VALUES ('RESPONSE_RECEIVED', $1)
    RETURNING *
    `, [attemptId]);
    return result.rows[0];
}
async function createResponseValidatedEvent(dbClient, attemptId) {
    const result = await dbClient.query(`INSERT INTO events(name, attempt_id) 
    VALUES ('RESPONSE_VALIDATED', $1)
    RETURNING *
    `, [attemptId]);
    return result.rows[0];
}
async function createAttemptCompletedEvent(dbClient, attemptId) {
    const result = await dbClient.query(`INSERT INTO events(name, attempt_id) 
    VALUES ('ATTEMPT_COMPLETED', $1)
    RETURNING *
    `, [attemptId]);
    return result.rows[0];
}
async function createJobCompletedEvent(dbClient, job_id) {
    const result = await dbClient.query(`INSERT INTO events(name, job_id) 
    VALUES ('JOB_COMPLETED', $1)
    RETURNING *
    `, [job_id]);
    return result.rows[0];
}
async function createAttemptFailedEvent(dbClient, attemptId, metadata) {
    const result = await dbClient.query(`INSERT INTO events(name, attempt_id, metadata) 
    VALUES ('ATTEMPT_FAILED', $1, $2)
    RETURNING *
    `, [attemptId, metadata]);
    return result.rows[0];
}
async function createJobFailedEvent(dbClient, job_id, metadata) {
    const result = await dbClient.query(`INSERT INTO events(name, job_id, metadata) 
    VALUES ('JOB_FAILED', $1, $2)
    RETURNING *
    `, [job_id, metadata]);
    return result.rows[0];
}
async function createRetryCreatedEvent(dbClient, job_id, attemptId, metadata) {
    const result = await dbClient.query(`INSERT INTO events(name, job_id, attempt_id, metadata) 
    VALUES ('RETRY_CREATED', $1, $2, $3)
    RETURNING *
    `, [job_id, attemptId, metadata]);
    return result.rows[0];
}
async function createRecoveryStartedEvent(dbClient, job_id, metadata, attemptId) {
    const result = await dbClient.query(`INSERT INTO events(name, attempt_id, job_id, metadata) 
    VALUES ('RECOVERY_STARTED', $1, $2, $3)
    RETURNING *
    `, [attemptId || null, job_id, metadata]);
    return result.rows[0];
}
async function createRecoveryAbandonedEvent(dbClient, job_id, metadata, attemptId) {
    const result = await dbClient.query(`INSERT INTO events(name, attempt_id, job_id, metadata) 
    VALUES ('RECOVERY_ABANDONED', $1, $2, $3)
    RETURNING *
    `, [attemptId || null, job_id, metadata]);
    return result.rows[0];
}
async function createCreditsAddedEvent(dbClient, user_id, metadata) {
    const result = await dbClient.query(`INSERT INTO events(name, user_id, metadata) 
    VALUES ('CREDITS_ADDED', $1, $2)
    RETURNING *
    `, [user_id, metadata]);
    return result.rows[0];
}
async function createCreditsDeductedEvent(dbClient, user_id, metadata) {
    const result = await dbClient.query(`INSERT INTO events(name, user_id, metadata) 
    VALUES ('CREDITS_DEDUCTED', $1, $2)
    RETURNING *
    `, [user_id, metadata]);
    return result.rows[0];
}
async function createRecoveryCompletedEvent(dbClient, job_id, metadata, attemptId) {
    const result = await dbClient.query(`INSERT INTO events(name, attempt_id, job_id, metadata) 
    VALUES ('RECOVERY_COMPLETED', $1, $2, $3)
    RETURNING *
    `, [attemptId || null, job_id, metadata]);
    return result.rows[0];
}
async function deleteEvent(dbClient, eventId) {
    const result = await dbClient.query(`DELETE FROM events WHERE event_id = $1`, [eventId]);
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
