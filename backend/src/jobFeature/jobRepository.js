import { ForbiddenError } from "../errors/applicationErrors.js";
async function getJobById(dbClient, job_id) {
    const link = await dbClient.prepare(`SELECT * FROM jobs 
    WHERE job_id = ?1`).get(job_id);
    if (!link)
        return null;
    return link;
}
async function getJobsByUserId(dbClient, user_id) {
    const link = await dbClient.prepare(`SELECT users.user_id, jobs.job_id, jobs.state, jobs.data 
     FROM users
     JOIN jobs
     ON users.user_id  = jobs.user_id
    WHERE user_id = ?1
    ;`).get(user_id);
    if (!link)
        return null;
    return link;
}
async function getAttemptsOfJob(dbClient, job_id) {
    const link = await dbClient.prepare(`
    SELECT * FROM attempts 
    WHERE job_id = ?1
    ORDER BY attempt_number DESC
    ;`).get(job_id);
    if (link.rows.length === 0)
        return null;
    return link.rows;
}
async function getLastAttemptOfJob(dbClient, job_id) {
    const link = await dbClient.prepare(`
    SELECT * FROM attempts 
    WHERE job_id = ?
    ORDER BY attempt_number DESC
    LIMIT 1
    ;`).get(job_id);
    if (link.rows.length === 0)
        return null;
    return link;
}
async function createJob(dbClient, user_id, type, body, estimated_cost) {
    const link = await dbClient.prepare(`
    INSERT INTO jobs (state, type, JSON.stringify(body), user_id, estimated_cost)
    VALUES (?1, ?2, ?3, ?4, ?5)
    RETURNING *
    ;`).get('CREATED', type, JSON.stringify(body), user_id, estimated_cost);
    if (!link)
        return null;
    return link;
}
async function deleteJob(dbClient, job_id) {
    const link = await dbClient.prepare(`
    DELETE FROM jobs WHERE job_id = ?
    `).get(job_id);
    if (link === 0)
        return 1;
    return 0;
}
async function changeJobState(dbClient, job_id, state) {
    const link = await dbClient.prepare(`
  UPDATE jobs
  SET state = ?2
  WHERE job_id = ?1
  ;`).get(job_id, state);
    if (!link)
        return null;
    return link;
}
async function markAccepted(dbClient, job_id) {
    const link = await dbClient.prepare(`UPDATE jobs
    SET state = ?3, updated_at = datetime('now')
    WHERE job_id = ?1
    AND state = ?2
    RETURNING *
    ;`).get(job_id, 'CREATED', 'ACCEPTED');
    if (!link)
        return null;
    return link;
}
async function markQueued(dbClient, job_id) {
    const link = await dbClient.prepare(`UPDATE jobs
    SET state = ?3, updated_at = datetime('now')
    WHERE job_id = ?1
    AND state = ?2
    RETURNING *
    ;`).get(job_id, 'ACCEPTED', 'QUEUED');
    if (!link)
        return null;
    return link;
}
async function markProcessing(dbClient, job_id) {
    const link = await dbClient.prepare(`UPDATE jobs
    SET state = ?3, updated_at = datetime()
    WHERE job_id = ?1
    AND state = ?2
    RETURNING *
    ;`).get(job_id, 'QUEUED', 'PROCESSING');
    if (!link)
        return null;
    return link;
}
async function markCompleted(dbClient, job_id, validatedData, actual_cost) {
    if (!validatedData || validatedData === null)
        throw new ForbiddenError("Data can't be empty");
    if (!actual_cost || actual_cost === null)
        throw new ForbiddenError("Actual cost can't be empty");
    const data = JSON.stringify(validatedData);
    const link = await dbClient.prepare(`UPDATE jobs
    SET state = ?3, data = ?4, actual_cost = ?5, updated_at = datetime('now'), completed_at = datetime('now')
    WHERE job_id = ?1
    AND state = ?2
    RETURNING *
    ;`).get(job_id, 'PROCESSING', 'COMPLETED', JSON.stringify(data), actual_cost);
    if (!link)
        return null;
    return link;
}
async function markFailed(dbClient, job_id, error) {
    const link = await dbClient.prepare(`UPDATE jobs
    SET state = ?2, error = ?3, updated_at = datetime('now')
    WHERE job_id = ?1
    AND state = ('CREATED', 'ACCEPTED', 'QUEUED', 'PROCESSING')
    RETURNING *`).get(job_id, "FAILED", error);
    if (!link)
        return null;
    return link;
}
export default {
    getJobById,
    getJobsByUserId,
    getLastAttemptOfJob,
    deleteJob,
    changeJobState,
    getAttemptsOfJob,
    createJob,
    markAccepted,
    markQueued,
    markProcessing,
    markCompleted,
    markFailed,
};
