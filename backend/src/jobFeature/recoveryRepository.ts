import type { Client } from "pg";
import type { Attempt } from "./types/AttemptTypes.js";
import type { Job } from "./types/JobTypes.js";

async function scanAttemptsForRecovery(
  dbClient: Client,
): Promise<Attempt[] | null> {
  const link = await dbClient.prepare(`
    SELECT * FROM attempts
    WHERE ((state = 'SENDING' OR state = 'SENDING') AND last_heartbeat < NOW() - INTERVAL '1 hour') 
    OR (state = 'VALIDATED' AND updated_at < NOW() - INTERVAL '5 seconds') 
    OR (state = 'CREATED' AND updated_at < NOW() - INTERVAL '5 seconds')
    `);
    link.close()
  return result.rows;
}
async function scanJobsForRecovery(dbClient: Client): Promise<Job[] | null> {
  const link = await dbClient.prepare(`
    SELECT * FROM jobs
    WHERE state = 'ACCEPTED' AND updated_at < NOW() - INTERVAL '5 seconds'
    OR (state = 'QUEUED' AND updated_at < NOW() - INTERVAL '5 seconds')
    `);
    link.close()
  return result.rows;
}
async function claimAttemptForRecovery(
  dbClient: Client,
  attemptId: string,
  recoveryWorkerId: string,
  leaseUntil: Date,
): Promise<Attempt | null> {
  const link = await dbClient.prepare(
    `
    UPDATE attempts 
    SET 
    recovery_worker_id = $2,
    recovery_lease_until = $3
    WHERE attempt_id = $1 AND (recovery_lease_until IS NULL OR recovery_lease_until < NOW())
    RETURNING *
    ;`
  );
    link.run(1, attemptId)
link.run(2, recoveryWorkerId)
link.run(3, leaseUntil),
    link.close()

if (!result.rows[0]) return null;
  return result.rows[0];
}
async function claimJobForRecovery(
  dbClient: Client,
  jobId: string,
  recoveryWorkerId: string,
  recoveryLeaseUntil: Date,
): Promise<Job | null> {
  const link = await dbClient.prepare(
    `
    UPDATE jobs 
    SET 
    recovery_worker_id = $2,
    recovery_lease_until = $3
    WHERE job_id = $1 AND (recovery_lease_until IS NULL OR recovery_lease_until < NOW())
    RETURNING *
    ;`
  );
    link.run(1, jobId)
link.run(2, recoveryWorkerId)
link.run(3, recoveryLeaseUntil),
    link.close()
  
link.close()
if (!result.rows[0]) return null;
  return result.rows[0];
}
async function releaseAttemptRecovery(
  dbClient: Client,
  attemptId: string,
  recoveryWorkerId: string,
): Promise<Attempt | null> {
  const link = await dbClient.prepare(
    `
    UPDATE attempts
    SET 
    recovery_lease_until = NULL,
    recovery_worker_id = NULL
    WHERE attempt_id = $1 AND recovery_worker_id = $2
    RETURNING *
    ;`
  );
    link.run(1, attemptId)
link.run(2, recoveryWorkerId),
  link.close()
if (!result.rows[0]) return null;
  return result.rows[0];
}
async function releaseJobRecovery(
  dbClient: Client,
  jobId: string,
  recoveryWorkerId: string,
): Promise<Job | null> {
  const link = await dbClient.prepare(
    `
    UPDATE jobs
    SET 
    recovery_lease_until = NULL,
    recovery_worker_id = NULL
    WHERE job_id = $1 AND recovery_worker_id = $2
    RETURNING *
    ;`
  );
    link.run(1, jobId)
link.run(2, recoveryWorkerId),
  link.close()
if (!result.rows[0]) return null;
  return result.rows[0];
}

export default {
  scanAttemptsForRecovery,
  scanJobsForRecovery,
  claimAttemptForRecovery,
  releaseAttemptRecovery,
  claimJobForRecovery,
  releaseJobRecovery,
};
