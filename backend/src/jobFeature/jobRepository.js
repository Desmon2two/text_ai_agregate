async function getJobById(dbClient, job_id) {
    const result = await dbClient.query(`
    SELECT * FROM jobs 
    WHERE job_id = $1
    `, [job_id]);
    if (!result.rows[0])
        return null;
    return result.rows[0];
}
async function getAttemptsPerJob(dbClient, jobId) {
    const result = await dbClient.query(`
    SELECT * FROM attempts 
    WHERE job_id = $1
    ORDER BY attempt_number DESC
    `, [jobId]);
    return result.rows;
}
async function createJob({ dbClient, type, body, userId, estimatedCost, }) {
    const result = await dbClient.query(`
    INSERT INTO jobs (state, type, body, user_id, estimated_cost)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
    `, ["CREATED", type, body, userId, estimatedCost]);
    if (!result.rows[0])
        return null;
    return result.rows[0];
}
async function deleteJob(dbClient, jobId) {
    const result = await dbClient.query(`
    DELETE FROM jobs WHERE job_id = $1
    `, [jobId]);
    if (!result)
        return null;
    return result;
}
async function markAccepted(dbClient, jobId) {
    const result = await dbClient.query(`UPDATE jobs
    SET state = $3, updated_at = NOW()
    WHERE job_id = $1
    AND state = $2
    RETURNING *
    `, [jobId, "CREATED", "ACCEPTED"]);
    if (!result.rows[0])
        return null;
    return result.rows[0];
}
async function markQueued(dbClient, jobId) {
    const result = await dbClient.query(`UPDATE jobs
    SET state = $3, updated_at = NOW()
    WHERE job_id = $1
    AND state = $2
    RETURNING *
    `, [jobId, "ACCEPTED", "QUEUED"]);
    if (!result.rows[0])
        return null;
    return result.rows[0];
}
async function markProcessing(dbClient, jobId) {
    const result = await dbClient.query(`UPDATE jobs
    SET state = $3, updated_at = NOW()
    WHERE job_id = $1
    AND state = $2
    RETURNING *
    `, [jobId, "QUEUED", "PROCESSING"]);
    if (!result.rows[0])
        return null;
    return result.rows[0];
}
async function markCompleted(dbClient, jobId, data, actualCost) {
    const result = await dbClient.query(`UPDATE jobs
    SET state = $3, data = $4, actual_cost = $5, updated_at = NOW(), completed_at = NOW()
    WHERE job_id = $1
    AND state = $2
    RETURNING *
    `, [jobId, "PROCESSING", "COMPLETED", data, actualCost]);
    if (!result.rows[0])
        return null;
    return result.rows[0];
}
async function markFailed(dbClient, jobId, error) {
    const result = await dbClient.query(`UPDATE jobs
    SET state = $2, error = $3, updated_at = NOW()
    WHERE job_id = $1
    AND state = ('CREATED', 'ACCEPTED', 'QUEUED', 'PROCESSING')
    RETURNING *
    `, [jobId, "FAILED", error]);
    if (!result.rows[0])
        return null;
    return result.rows[0];
}
export default {
    getJobById,
    deleteJob,
    getAttemptsPerJob,
    createJob,
    markAccepted,
    markQueued,
    markProcessing,
    markCompleted,
    markFailed,
};
