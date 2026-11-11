import { dbTemplateDelete, dbTemplateInsert } from "../database/dbClient.js";
import { ForbiddenError } from "../errors/applicationErrors.js";
async function getAttemptById(dbClient, attempt_id) {
    const link = await dbClient.prepare(`SELECT * FROM attempts
      WHERE attempt_id = ?
      ;`).get(attempt_id);
    if (!link)
        return null;
    return link;
}
async function createAttempt(dbClient, job_id, attempt_number, provider, model) {
    console.log(provider.toString(), model.toString());
    return await dbTemplateInsert(dbClient, 'attempts', ['state', 'job_id', 'attempt_number', 'provider', 'model'], ['CREATED', Number(job_id), Number(attempt_number), provider.toString(), model.toString()]);
    //	const link = await dbClient.prepare(
    //		`INSERT INTO attempts(state, job_id, attempt_number, provider, model) 
    //    VALUES (?, ?, ?, ?, ?)
    //    RETURNING *
    //    ;`).get("CREATED", Number(job_id), Number(attempt_number), provider, model)
    //	if (!link) return null;
    //	return link;
}
async function deleteAttempt(dbClient, attempt_id) {
    const result = await dbTemplateDelete(dbClient, 'attempts', 'attempt_id', attempt_id);
    //	const link = await dbClient.prepare(
    //		`DELETE FROM attempts WHERE attempt_id = ?
    //    ;`).run(Number(attempt_id))
    //	if (link.changes === 0) return null
    //	return 1;
    return result;
}
async function markSending(dbClient, attempt_id) {
    const link = await dbClient.prepare(`UPDATE attempts
    SET state = ?2, updated_at = datetime('now')
    WHERE attempt_id = ?3
    AND state = ?1
    RETURNING *
    ;`).get("CREATED", "SENDING", Number(attempt_id));
    if (!link)
        return null;
    return link;
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
//	if (!link.rows[0]) return null;
//   return link.rows[0];
// }
async function markReceived(dbClient, attempt_id, data) {
    const serializedData = JSON.stringify(data);
    const link = await dbClient.prepare(`UPDATE attempts
    SET state = ?, data = json(?), updated_at = datetime('now')
    WHERE attempt_id = ?
    AND state = ?
    RETURNING *
    ;`).get("RECEIVED", serializedData, attempt_id, "SENDING");
    if (!link)
        return null;
    return link;
}
async function markValidated(dbClient, attempt_id, data) {
    if (data === null || !data)
        throw new ForbiddenError("Data can't be null while validating attempt");
    const serializedData = JSON.stringify(data);
    const link = await dbClient.prepare(`UPDATE attempts
		SET state = ?1, data = ?2, updated_at = datetime('now')
		WHERE attempt_id = ?3
    	AND state = ?4
    	RETURNING *
    ;`).get("VALIDATED", serializedData, attempt_id, "RECEIVED");
    console.log(link);
    if (!link)
        return null;
    return link;
}
async function markCompleted(dbClient, attempt_id) {
    const link = await dbClient.prepare(`UPDATE attempts
    SET state = ?2, updated_at = datetime('now'), completed_at = datetime('now')
    WHERE attempt_id = ?3
    AND state = ?1
    RETURNING *
    ;`).get('VALIDATED', 'COMPLETED', attempt_id);
    if (!link)
        return null;
    link.data = JSON.parse(link.data);
    return link;
}
async function markFailed(dbClient, attempt_id, error) {
    const link = await dbClient.prepare(`UPDATE attempts
    SET state = ?, error = ?, updated_at = datetime()
    WHERE attempt_id = ?
    AND state IN ('CREATED', 'SENDING', 'WAITING', 'RECEIVED', 'VALIDATED')
    RETURNING *
    ;`).get("FAILED", error, attempt_id);
    if (!link)
        return null;
    return link;
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
