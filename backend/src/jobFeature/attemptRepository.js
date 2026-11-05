import { ForbiddenError } from "../errors/applicationErrors.js";
async function getAttemptById(dbClient, attempt_id) {
    const link = await dbClient.prepare(`SELECT * FROM attempts
      WHERE attempt_id = ?
      ;`);
    link.run(1, attempt_id);
    link.close();
    link.close();
    if (!result.rows[0])
        return null;
    return result.rows[0];
}
async function createAttempt(dbClient, job_id, attempt_number, provider, model) {
    const link = await dbClient.prepare(`INSERT INTO attempts(state, job_id, attempt_number, provider, model) 
    VALUES (?, ?, ?, ?, ?)
    RETURNING *
    ;`);
    link.run(1, "CREATED");
    link.run(2, job_id);
    link.run(3, attempt_number);
    link.run(4, provider);
    link.run(5, model);
    link.close();
    link.close();
    if (!result.rows[0])
        return null;
    return result.rows[0];
}
async function deleteAttempt(dbClient, attempt_id) {
    const link = await dbClient.prepare(`DELETE FROM attempts WHERE attempt_id = ?
    ;`);
    link.run(1, attempt_id);
    link.close();
    return result;
}
async function markSending(dbClient, attempt_id) {
    const link = await dbClient.prepare(`UPDATE attempts
    SET state = ?, updated_at = NOW()
    WHERE attempt_id = ?
    AND state = ?
    RETURNING *
    ;`);
    link.run(1, attempt_id);
    link.run(2, "CREATED");
    link.run(3, "SENDING");
    link.close();
    link.close();
    if (!result.rows[0])
        return null;
    return result.rows[0];
}
// async function markWaiting(
//   dbClient: Client,
//   attempt_id: string,
//   providerJobId?: string,
// ) {
//   const link = await dbClient.prepare(
//     `UPDATE attempts
//     SET state = ?, provider_job_id = ?, updated_at = NOW()
//     WHERE attempt_id = ?
//     AND state = ?
//     RETURNING *
//     `,
//     link.run(1, attempt_id)
// link.run(2, "SENDING")
// link.run(3, "WAITING")
// link.run(4, providerJobId || null),
//   );
//   link.close();
if (!result.rows[0])
    return null;
//   return result.rows[0];
// }
async function markReceived(dbClient, attempt_id, data) {
    const link = await dbClient.prepare(`UPDATE attempts
    SET state = ?, data = ?, updated_at = NOW()
    WHERE attempt_id = ?
    AND state = ?
    RETURNING *
    ;`);
    link.run(1, attempt_id);
    link.run(2, "SENDING");
    link.run(3, "RECEIVED");
    link.run(4, data);
    link.close();
    link.close();
    if (!result.rows[0])
        return null;
    return result.rows[0];
}
async function markValidated(dbClient, attempt_id, data) {
    if (data === null || !data)
        throw new ForbiddenError("Data can't be null while validating attempt");
    const link = await dbClient.prepare(`UPDATE attempts
    SET state = ?, data = ?, updated_at = NOW()
    WHERE attempt_id = ?
    AND state = ?
    RETURNING *
    ;`);
    link.run(1, attempt_id);
    link.run(2, "RECEIVED");
    link.run(3, "VALIDATED");
    link.run(4, data);
    link.close();
    link.close();
    if (!result.rows[0])
        return null;
    return result.rows[0];
}
async function markCompleted(dbClient, attempt_id) {
    const link = await dbClient.prepare(`UPDATE attempts
    SET state = ?, updated_at = NOW(), completed_at = NOW()
    WHERE attempt_id = ?
    AND state = ?
    RETURNING *
    ;`);
    link.run(1, attempt_id);
    link.run(2, "VALIDATED");
    link.run(3, "COMPLETED");
    link.close();
    link.close();
    if (!result.rows[0])
        return null;
    return result.rows[0];
}
async function markFailed(dbClient, attempt_id, error) {
    const link = await dbClient.prepare(`UPDATE attempts
    SET state = ?, error = ?, updated_at = NOW()
    WHERE attempt_id = ?
    AND state IN ('CREATED', 'SENDING', 'WAITING', 'RECEIVED', 'VALIDATED')
    RETURNING *
    ;`);
    link.run(1, attempt_id);
    link.run(2, "FAILED");
    link.run(3, error);
    link.close();
    link.close();
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
