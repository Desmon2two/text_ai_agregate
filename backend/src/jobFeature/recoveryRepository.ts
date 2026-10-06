import { Client } from "pg";
import { Attempt } from "./types/AttemptTypes";
import { Job } from "./types/JobTypes";

async function scanAttemptsForRecovery(
  dbClient: Client,
): Promise<Attempt[] | null> {
  const result = await dbClient.query(`
    SELECT * FROM attempts
    WHERE ((state = 'SENDING' OR state = 'WAITING') AND last_heartbeat < NOW() - INTERVAL '1 hour') 
    OR (state = 'VALIDATED' AND updated_at < NOW() - INTERVAL '5 seconds') 
    OR (state = 'CREATED' AND updated_at < NOW() - INTERVAL '5 seconds')
    `);
  return result.rows;
}
async function scanJobsForRecovery(dbClient: Client): Promise<Job[] | null> {
  const result = await dbClient.query(`
    SELECT * FROM jobs
    WHERE state = 'ACCEPTED' AND updated_at < NOW() - INTERVAL '5 seconds'
    OR (state = 'QUEUED' AND updated_at < NOW() - INTERVAL '5 seconds')
    `);
  return result.rows;
}
async function claimAttemptForRecovery(
  dbClient: Client,
  attemptId: string,
  recoveryWorkerId: string,
  leaseUntil: Date,
): Promise<Attempt | null> {
  const result = await dbClient.query(
    `
    UPDATE attempts 
    SET 
    recovery_worker_id = $2,
    recovery_lease_until = $3
    WHERE attempt_id = $1 AND (recovery_lease_until IS NULL OR recovery_lease_until < NOW())
    RETURNING *
    `,
    [attemptId, recoveryWorkerId, leaseUntil],
  );
  return result.rows[0];
}
async function claimJobForRecovery(
  dbClient: Client,
  jobId: string,
  recoveryWorkerId: string,
  recoveryLeaseUntil: Date,
): Promise<Job | null> {
  const result = await dbClient.query(
    `
    UPDATE jobs 
    SET 
    recovery_worker_id = $2,
    recovery_lease_until = $3
    WHERE job_id = $1 AND (recovery_lease_until IS NULL OR recovery_lease_until < NOW())
    RETURNING *
    `,
    [jobId, recoveryWorkerId, recoveryLeaseUntil],
  );
  return result.rows[0];
}
async function releaseAttemptRecovery(
  dbClient: Client,
  attemptId: string,
  recoveryWorkerId: string,
) {
  const result = await dbClient.query(
    `
    UPDATE attempts
    SET 
    recovery_lease_until = NULL,
    recovery_worker_id = NULL
    WHERE attempt_id = $1 AND recovery_worker_id = $2
    RETURNING *
    `,
    [attemptId, recoveryWorkerId],
  );
  return result.rows[0];
}
async function releaseJobRecovery(
  dbClient: Client,
  jobId: string,
  recoveryWorkerId: string,
) {
  const result = await dbClient.query(
    `
    UPDATE jobs
    SET 
    recovery_lease_until = NULL,
    recovery_worker_id = NULL
    WHERE job_id = $1 AND recovery_worker_id = $2
    RETURNING *
    `,
    [jobId, recoveryWorkerId],
  );
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
