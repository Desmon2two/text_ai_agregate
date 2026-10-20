import { Client } from "pg";
async function createJobAcceptedEvent(dbClient, jobId) {
    const result = await dbClient.query(`INSERT INTO events(name, job_id) 
    VALUES ('JOB_ACCEPTED', $1)
    RETURNING *
    `, [jobId]);
    return result.rows[0];
}
async function createJobProcessingEvent(dbClient, jobId) {
    const result = await dbClient.query(`INSERT INTO events(name, job_id) 
    VALUES ('JOB_PROCESSING', $1)
    RETURNING *
    `, [jobId]);
    return result.rows[0];
}
async function createJobProcessedFromIntermediateStateEvent(dbClient, jobId) {
    const result = await dbClient.query(`INSERT INTO events(name, job_id) 
    VALUES ('JOB_PROCESSING_FROM_INTERMEDIATE_STATE', $1)
    RETURNING *
    `, [jobId]);
    return result.rows[0];
}
async function createWorkerStartedEvent(dbClient, jobId) {
    const result = await dbClient.query(`INSERT INTO events(name, job_id) 
    VALUES ('WORKER_STARTED', $1)
    RETURNING *
    `, [jobId]);
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
async function createJobCompletedEvent(dbClient, jobId) {
    const result = await dbClient.query(`INSERT INTO events(name, job_id) 
    VALUES ('JOB_COMPLETED', $1)
    RETURNING *
    `, [jobId]);
    return result.rows[0];
}
async function createAttemptFailedEvent(dbClient, attemptId, metadata) {
    const result = await dbClient.query(`INSERT INTO events(name, attempt_id, metadata) 
    VALUES ('ATTEMPT_FAILED', $1, $2)
    RETURNING *
    `, [attemptId, metadata]);
    return result.rows[0];
}
async function createJobFailedEvent(dbClient, jobId, metadata) {
    const result = await dbClient.query(`INSERT INTO events(name, job_id, metadata) 
    VALUES ('JOB_FAILED', $1, $2)
    RETURNING *
    `, [jobId, metadata]);
    return result.rows[0];
}
async function createRetryCreatedEvent(dbClient, jobId, attemptId, metadata) {
    const result = await dbClient.query(`INSERT INTO events(name, job_id, attempt_id, metadata) 
    VALUES ('RETRY_CREATED', $1, $2, $3)
    RETURNING *
    `, [jobId, attemptId, metadata]);
    return result.rows[0];
}
async function createRecoveryStartedEvent(dbClient, jobId, metadata, attemptId) {
    const result = await dbClient.query(`INSERT INTO events(name, attempt_id, job_id, metadata) 
    VALUES ('RECOVERY_STARTED', $1, $2, $3)
    RETURNING *
    `, [attemptId || null, jobId, metadata]);
    return result.rows[0];
}
async function createRecoveryAbandonedEvent(dbClient, jobId, metadata, attemptId) {
    const result = await dbClient.query(`INSERT INTO events(name, attempt_id, job_id, metadata) 
    VALUES ('RECOVERY_ABANDONED', $1, $2, $3)
    RETURNING *
    `, [attemptId || null, jobId, metadata]);
    return result.rows[0];
}
async function createRecoveryCompletedEvent(dbClient, jobId, metadata, attemptId) {
    const result = await dbClient.query(`INSERT INTO events(name, attempt_id, job_id, metadata) 
    VALUES ('RECOVERY_COMPLETED', $1, $2, $3)
    RETURNING *
    `, [attemptId || null, jobId, metadata]);
    return result.rows[0];
}
async function deleteEvent(dbClient, eventId, metadata) {
    const result = await dbClient.query(`DELETE FROM events WHERE event_id = $1`, [eventId]);
    if (result.rows[0] === 0)
        return null;
    return result.rows[0];
}
export default {
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
};
//# sourceMappingURL=eventRepository.js.map