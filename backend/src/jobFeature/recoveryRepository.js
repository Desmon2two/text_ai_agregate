async function scanAttemptsForRecovery(dbClient) {
    const link = await dbClient.prepare(`
    SELECT * FROM attempts
    WHERE ((state = 'SENDING' OR state = 'SENDING') AND last_heartbeat < datetime() - INTERVAL '1 hour') 
    OR (state = 'VALIDATED' AND updated_at < datetime() - INTERVAL '5 seconds') 
    OR (state = 'CREATED' AND updated_at < datetime() - INTERVAL '5 seconds')
    `);
    link.close();
    return link.rows;
}
async function scanJobsForRecovery(dbClient) {
    const link = await dbClient.prepare(`
    SELECT * FROM jobs
    WHERE state = 'ACCEPTED' AND updated_at < datetime() - INTERVAL '5 seconds'
    OR (state = 'QUEUED' AND updated_at < datetime() - INTERVAL '5 seconds')
    `);
    link.close();
    return link.rows;
}
async function claimAttemptForRecovery(dbClient, attemptId, recoveryWorkerId, leaseUntil) {
    const link = await dbClient.prepare(`
    UPDATE attempts 
    SET 
    recovery_worker_id = ?,
    recovery_lease_until = ? 
    WHERE attempt_id = ? AND (recovery_lease_until IS NULL OR recovery_lease_until < datetime())
    RETURNING *
    ;`);
    link.run(1, attemptId);
    link.run(2, recoveryWorkerId);
    link.run(3, leaseUntil);
    link.close();
    if (!link.rows[0])
        return null;
    return link.rows[0];
}
async function claimJobForRecovery(dbClient, jobId, recoveryWorkerId, recoveryLeaseUntil) {
    const link = await dbClient.prepare(`
    UPDATE jobs 
    SET 
    recovery_worker_id = ?,
    recovery_lease_until = ?
    WHERE job_id = ? AND (recovery_lease_until IS NULL OR recovery_lease_until < datetime())
    RETURNING *
    ;`);
    link.run(1, jobId);
    link.run(2, recoveryWorkerId);
    link.run(3, recoveryLeaseUntil);
    link.close();
    if (!link.rows[0])
        return null;
    return link.rows[0];
}
async function releaseAttemptRecovery(dbClient, attemptId, recoveryWorkerId) {
    const link = await dbClient.prepare(`
    UPDATE attempts
    SET 
    recovery_lease_until = NULL,
    recovery_worker_id = NULL
    WHERE attempt_id = ? AND recovery_worker_id = ?
    RETURNING *
    ;`);
    link.run(1, attemptId);
    link.run(2, recoveryWorkerId);
    link.close();
    if (!link.rows[0])
        return null;
    return link.rows[0];
}
async function releaseJobRecovery(dbClient, jobId, recoveryWorkerId) {
    const link = await dbClient.prepare(`
    UPDATE jobs
    SET 
    recovery_lease_until = NULL,
    recovery_worker_id = NULL
    WHERE job_id = ? AND recovery_worker_id = ?
    RETURNING *
    ;`);
    link.run(1, jobId);
    link.run(2, recoveryWorkerId);
    link.close();
    if (!link.rows[0])
        return null;
    return link.rows[0];
}
export default {
    scanAttemptsForRecovery,
    scanJobsForRecovery,
    claimAttemptForRecovery,
    releaseAttemptRecovery,
    claimJobForRecovery,
    releaseJobRecovery,
};
