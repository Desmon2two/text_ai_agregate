import { Client } from "pg";
import { CreateJob, Job } from "./types/JobTypes";
import { Attempt } from "./types/AttemptTypes";
async function getJob(dbClient: Client, jobId: string): Promise<Job | null> {
  const result = await dbClient.query(
    `
    SELECT * FROM jobs 
    WHERE job_id = $1
    `,
    [jobId],
  );
  return result.rows[0];
}
async function getAttemptsPerJob(dbClient: Client, jobId: string): Promise<Attempt[] | null> {
  const result = await dbClient.query(
    `
    SELECT * FROM attempts 
    WHERE job_id = $1
    ORDER BY attempt_number DESC
    `,
    [jobId],
  );
  return result.rows;
}
async function createJob({
  dbClient,
  type,
  body,
  userId,
  estimatedCost,
}: CreateJob) {
  const result = await dbClient.query(
    `
    INSERT INTO jobs (state, type, body, user_id, estimated_cost)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
    `,
    ["CREATED", type, body, userId, estimatedCost],
  );
  return result.rows[0];
}
async function markAccepted(dbClient: Client, jobId: string) {
  const result = await dbClient.query(
    `UPDATE jobs
    SET state = $3, updated_at = NOW()
    WHERE job_id = $1
    AND state = $2
    RETURNING *
    `,
    [jobId, "CREATED", "ACCEPTED"],
  );
  return result.rows[0];
}
async function markQueued(dbClient: Client, jobId: string) {
  const result = await dbClient.query(
    `UPDATE jobs
    SET state = $3, updated_at = NOW()
    WHERE job_id = $1
    AND state = $2
    RETURNING *
    `,
    [jobId, "ACCEPTED", "QUEUED"],
  );
  return result.rows[0];
}
async function markProcessing(dbClient: Client, jobId: string) {
  const result = await dbClient.query(
    `UPDATE jobs
    SET state = $3, updated_at = NOW()
    WHERE job_id = $1
    AND state = $2
    RETURNING *
    `,
    [jobId, "QUEUED", "PROCESSING"],
  );
  return result.rows[0];
}
async function markCompleted(dbClient: Client, jobId: string, data: unknown, actualCost: number) {
  const result = await dbClient.query(
    `UPDATE jobs
    SET state = $3, data = $4, actual_cost = $5, updated_at = NOW(), completed_at = NOW()
    WHERE job_id = $1
    AND state = $2
    RETURNING *
    `,
    [jobId, "PROCESSING", "COMPLETED", data, actualCost],
  );
  return result.rows[0];
}
async function markFailed(dbClient: Client, jobId: string, error: unknown) {
  const result = await dbClient.query(
    `UPDATE jobs
    SET state = $2, error = $3, updated_at = NOW()
    WHERE job_id = $1
    AND state = ('CREATED', 'ACCEPTED', 'QUEUED', 'PROCESSING')
    RETURNING *
    `,
    [jobId, "FAILED", error],
  );
  return result.rows[0];
}
export default {
  getJob,
  getAttemptsPerJob,
  createJob,
  markAccepted,
  markQueued,
  markProcessing,
  markCompleted,
  markFailed,
};
