import { ForbiddenError } from "../errors/applicationErrors.js";
async function getAttemptById(dbClient, attempt_id) {
    const result = await dbClient.query(`SELECT * FROM attempts
      WHERE attempt_id = $1
      `, [attempt_id]);
    if (!result.rows[0])
        return null;
    return result.rows[0];
}
async function createAttempt(dbClient, job_id, attempt_number, provider, model) {
    const result = await dbClient.query(`INSERT INTO attempts(state, job_id, attempt_number, provider, model) 
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
    `, ["CREATED", job_id, attempt_number, provider, model]);
    if (!result.rows[0])
        return null;
    return result.rows[0];
}
async function deleteAttempt(dbClient, attempt_id) {
    const result = await dbClient.query(`DELETE FROM attempts WHERE attempt_id = $1
    `, [attempt_id]);
    return result;
}
async function markSending(dbClient, attempt_id) {
    const result = await dbClient.query(`UPDATE attempts
    SET state = $3, updated_at = NOW()
    WHERE attempt_id = $1
    AND state = $2
    RETURNING *
    `, [attempt_id, "CREATED", "SENDING"]);
    if (!result.rows[0])
        return null;
    return result.rows[0];
}
// async function markWaiting(
//   dbClient: Client,
//   attempt_id: string,
//   providerJobId?: string,
// ) {
//   const result = await dbClient.query(
//     `UPDATE attempts
//     SET state = $3, provider_job_id = $4, updated_at = NOW()
//     WHERE attempt_id = $1
//     AND state = $2
//     RETURNING *
//     `,
//     [attempt_id, "SENDING", "WAITING", providerJobId || null],
//   );
//   if (!result.rows[0]) return null;
//   return result.rows[0];
// }
async function markReceived(dbClient, attempt_id, data) {
    const result = await dbClient.query(`UPDATE attempts
    SET state = $3, data = $4, updated_at = NOW()
    WHERE attempt_id = $1
    AND state = $2
    RETURNING *
    `, [attempt_id, "SENDING", "RECEIVED", data]);
    if (!result.rows[0])
        return null;
    return result.rows[0];
}
async function markValidated(dbClient, attempt_id, data) {
    if (data === null || !data)
        throw new ForbiddenError("Data can't be null while validating attempt");
    const result = await dbClient.query(`UPDATE attempts
    SET state = $3, data = $4, updated_at = NOW()
    WHERE attempt_id = $1
    AND state = $2
    RETURNING *
    `, [attempt_id, "RECEIVED", "VALIDATED", data]);
    if (!result.rows[0])
        return null;
    return result.rows[0];
}
async function markCompleted(dbClient, attempt_id) {
    const result = await dbClient.query(`UPDATE attempts
    SET state = $3, updated_at = NOW(), completed_at = NOW()
    WHERE attempt_id = $1
    AND state = $2
    RETURNING *
    `, [attempt_id, "VALIDATED", "COMPLETED"]);
    if (!result.rows[0])
        return null;
    return result.rows[0];
}
async function markFailed(dbClient, attempt_id, error) {
    const result = await dbClient.query(`UPDATE attempts
    SET state = $2, error = $3, updated_at = NOW()
    WHERE attempt_id = $1
    AND state IN ('CREATED', 'SENDING', 'WAITING', 'RECEIVED', 'VALIDATED')
    RETURNING *
    `, [attempt_id, "FAILED", error]);
    if (!result.rows[0])
        return null;
    return result.rows[0];
}
export default {
    getAttemptById,
    deleteAttempt,
    createAttempt,
    markSending,
    // markWaiting,
    markReceived,
    markValidated,
    markCompleted,
    markFailed,
};
