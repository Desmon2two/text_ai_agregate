import { Client } from "pg";

async function scanForRecovery(dbClient: Client){
const result = await dbClient.query(`
    SELECT * FROM attempts
    WHERE (state = 'SENDING' AND last_heartbeat < NOW() - INTERVAL '1 hour') 
    OR (state = 'VALIDATED' AND updated_at < NOW() - INTERVAL '5 seconds') 
    OR (state = 'ACCEPTED' AND updated_at < NOW() - INTERVAL '5 seconds')
    `)
return result.rows
}
async function claimRecovery(dbClient: Client, attemptId: string, recoveryWorkerId: string, leaseUntil: Date){
const result = await dbClient.query(`
    UPDATE attempts 
    SET 
    recovery_worker_id = $2,
    recovery_lease_until = $3
    WHERE attempt_id = $1 AND (recovery_lease_until IS NULL OR recovery_lease_until < NOW())
    RETURNING *
    `, 
[attemptId, recoveryWorkerId, leaseUntil])
return result.rows[0]
}
async function releaseRecovery(dbClient: Client, attemptId: string, recoveryWorkerId: string){
const result = await dbClient.query(`
    UPDATE attempts
    SET 
    recovery_lease_until = NULL,
    recovery_worker_id = NULL
    WHERE attempt_id = $1 AND recovery_worker_id = $2
    RETURNING *
    `, 
[attemptId, recoveryWorkerId])
return result.rows[0]
}

export default {
    scanForRecovery,
    claimRecovery,
    releaseRecovery,
}