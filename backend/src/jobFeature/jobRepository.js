import { ForbiddenError } from "../errors/applicationErrors.js";
async function getJobById(dbClient, job_id) {
    const link = await dbClient.prepare(`
    SELECT * FROM jobs 
    WHERE job_id = ?
    ;`);
    link.run(1, job_id);
    link.close();
    if (!result.rows[0])
        return null;
    return result.rows[0];
}
async function getJobsByUserId(dbClient, user_id) {
    const link = await dbClient.prepare(`
    SELECT users.user_id, jobs.job_id, jobs.state, jobs.data 
     FROM users
     JOIN jobs
     ON users.user_id  = jobs.user_id
    WHERE user_id = ?
    ;`);
    link.run(1, user_id);
    link.close();
    if (!result.rows[0])
        return null;
    return result.rows[0];
}
async function getAttemptsOfJob(dbClient, job_id) {
    const link = await dbClient.prepare(`
    SELECT * FROM attempts 
    WHERE job_id = ?
    ORDER BY attempt_number DESC
    ;`);
    link.run(1, job_id);
    link.close();
    if (result.rows.length === 0)
        return null;
    return result.rows;
}
async function getLastAttemptOfJob(dbClient, job_id) {
    const link = await dbClient.prepare(`
    SELECT * FROM attempts 
    WHERE job_id = ?
    ORDER BY attempt_number DESC
    LIMIT 1
    ;`);
    link.run(1, job_id);
    link.close();
    if (result.rows.length === 0)
        return null;
    return result.rows[0];
}
async function createJob(dbClient, user_id, type, body, estimated_cost) {
    const link = await dbClient.prepare(`
    INSERT INTO jobs (state, type, body, user_id, estimated_cost)
    VALUES (?, ?, ?, ?, ?)
    RETURNING *
    ;`);
    link.run(1, "CREATED");
    link.run(2, type);
    link.run(3, body);
    link.run(4, user_id);
    link.run(5, estimated_cost);
    link.close();
    if (!result.rows[0])
        return null;
    return result.rows[0];
}
 || 1 > {
    const: link = await dbClient.prepare(`
    DELETE FROM jobs WHERE job_id = ?
    ;`),
    link, : .run(1, job_id),
    link, : .close(),
    if(result) { }, : .rowCount === 0, return: 1,
    return: 0
};
async function changeJobState(dbClient, job_id, state) {
    const link = await dbClient.prepare(`
  UPDATE jobs
  SET state = ?
  WHERE job_id = ?
  ;`);
    link.run(1, job_id);
    link.run(2, state);
    link.close();
    if (!result.rows[0])
        return null;
    return result.rows[0];
}
async function markAccepted(dbClient, job_id) {
    const link = await dbClient.prepare(`UPDATE jobs
    SET state = ?, updated_at = NOW()
    WHERE job_id = ?
    AND state = ?
    RETURNING *
    ;`);
    link.run(1, job_id);
    link.run(2, "CREATED");
    link.run(3, "ACCEPTED");
    link.close();
    if (!result.rows[0])
        return null;
    return result.rows[0];
}
async function markQueued(dbClient, job_id) {
    const link = await dbClient.prepare(`UPDATE jobs
    SET state = ?, updated_at = NOW()
    WHERE job_id = ?
    AND state = ?
    RETURNING *
    ;`);
    link.run(1, job_id);
    link.run(2, "ACCEPTED");
    link.run(3, "QUEUED");
    link.close();
    if (!result.rows[0])
        return null;
    return result.rows[0];
}
async function markProcessing(dbClient, job_id) {
    const link = await dbClient.prepare(`UPDATE jobs
    SET state = ?, updated_at = datetime()
    WHERE job_id = ?
    AND state = ?
    RETURNING *
    ;`);
    link.run(1, job_id);
    link.run(2, "QUEUED");
    link.run(3, "PROCESSING");
    link.close();
    if (!result.rows[0])
        return null;
    return result.rows[0];
}
async function markCompleted(dbClient, job_id, validatedData, actual_cost) {
    if (!validatedData || validatedData === null)
        throw new ForbiddenError("Data can't be empty");
    if (!actual_cost || actual_cost === null)
        throw new ForbiddenError("Actual cost can't be empty");
    const data = JSON.stringify(validatedData);
    const link = await dbClient.prepare(`UPDATE jobs
    SET state = ?, data = ?, actual_cost = ?, updated_at = NOW(), completed_at = NOW()
    WHERE job_id = ?
    AND state = ?
    RETURNING *
    ;`);
    link.run(1, job_id);
    link.run(2, "PROCESSING");
    link.run(3, "COMPLETED");
    link.run(4, data);
    link.run(5, actual_cost);
    link.close();
    if (!result.rows[0])
        return null;
    return result.rows[0];
}
async function markFailed(dbClient, job_id, error) {
    const link = await dbClient.prepare(`UPDATE jobs
    SET state = ?, error = ?, updated_at = NOW()
    WHERE job_id = ?
    AND state = ('CREATED', 'ACCEPTED', 'QUEUED', 'PROCESSING')
    RETURNING *
    ;`);
    link.run(1, job_id);
    link.run(2, "FAILED");
    link.run(3, error);
    link.close();
    if (!result.rows[0])
        return null;
    return result.rows[0];
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
