async function getAttempt(dbClient, attemptId) {
    const result = await dbClient.query(`SELECT * FROM attempts
      WHERE attempt_id = $1
      `, [attemptId]);
    if (!result.rows[0])
        return null;
    return result.rows[0];
}
async function createAttempt({ dbClient, job_id, attemptNumber, provider, model, }) {
    const result = await dbClient.query(`INSERT INTO attempts(state, job_id, attempt_number, provider, model) 
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
    `, ["CREATED", job_id, attemptNumber, provider, model]);
    if (!result.rows[0])
        return null;
    return result.rows[0];
}
async function deleteAttempt(dbClient, attempt_id) {
    const result = await dbClient.query(`DELETE FROM attempts WHERE attempt_id = $1
    `, [attempt_id]);
    return result;
}
async function markSending(dbClient, attemptId) {
    const result = await dbClient.query(`UPDATE attempts
    SET state = $3, updated_at = NOW()
    WHERE attempt_id = $1
    AND state = $2
    RETURNING *
    `, [attemptId, "CREATED", "SENDING"]);
    if (!result.rows[0])
        return null;
    return result.rows[0];
}
async function markWaiting(dbClient, attemptId, providerJobId) {
    const result = await dbClient.query(`UPDATE attempts
    SET state = $3, provider_job_id = $4, updated_at = NOW()
    WHERE attempt_id = $1
    AND state = $2
    RETURNING *
    `, [attemptId, "SENDING", "WAITING", providerJobId || null]);
    if (!result.rows[0])
        return null;
    return result.rows[0];
}
async function markReceived(dbClient, attemptId, data) {
    const result = await dbClient.query(`UPDATE attempts
    SET state = $3, data = $4, updated_at = NOW()
    WHERE attempt_id = $1
    AND state = $2
    RETURNING *
    `, [attemptId, "WAITING", "RECEIVED", data]);
    if (!result.rows[0])
        return null;
    return result.rows[0];
}
async function markValidated(dbClient, attemptId, data) {
    const result = await dbClient.query(`UPDATE attempts
    SET state = $3, data = $4, updated_at = NOW()
    WHERE attempt_id = $1
    AND state = $2
    RETURNING *
    `, [attemptId, "RECEIVED", "VALIDATED", data]);
    if (!result.rows[0])
        return null;
    return result.rows[0];
}
async function markCompleted(dbClient, attemptId, data) {
    const result = await dbClient.query(`UPDATE attempts
    SET state = $3, data = $4, updated_at = NOW(), completed_at = NOW()
    WHERE attempt_id = $1
    AND state = $2
    RETURNING *
    `, [attemptId, "VALIDATED", "COMPLETED", data]);
    if (!result.rows[0])
        return null;
    return result.rows[0];
}
async function markFailed(dbClient, attemptId, error) {
    const result = await dbClient.query(`UPDATE attempts
    SET state = $2, error = $3, updated_at = NOW()
    WHERE attempt_id = $1
    AND state IN ('CREATED', 'SENDING', 'WAITING', 'RECEIVED', 'VALIDATED')
    RETURNING *
    `, [attemptId, "FAILED", error]);
    if (!result.rows[0])
        return null;
    return result.rows[0];
}
export default {
    getAttempt,
    deleteAttempt,
    createAttempt,
    markSending,
    markWaiting,
    markReceived,
    markValidated,
    markCompleted,
    markFailed,
};
