import { Client } from "pg";
import { CreateJob } from "./types/JobTypes";
async function getJob(dbClient: Client, jobId: string) {
  const result = await dbClient.query(
    `
    SELECT * FROM jobs 
    WHERE job_id = $1
    `,
    [jobId],
  );
  return result.rows[0];
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
  if (result.rows.length === 0) {
    throw new Error("Job transition failed");
  }
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
  if (result.rows.length === 0) {
    throw new Error("Job transition failed");
  }
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
  if (result.rows.length === 0) {
    throw new Error("Job transition failed");
  }
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
  if (result.rows.length === 0) {
    throw new Error("Job transition failed");
  }
  return result.rows[0];
}
async function markComplete(dbClient: Client, jobId: string, data: unknown) {
  const result = await dbClient.query(
    `UPDATE jobs
    SET state = $3, data = $4, updated_at = NOW(), completed_at = NOW()
    WHERE job_id = $1
    AND state = $2
    RETURNING *
    `,
    [jobId, "PROCESSING", "COMPLETE"],
  );
  if (result.rows.length === 0) {
    throw new Error("Job transition failed");
  }
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
  if (result.rows.length === 0) {
    throw new Error("Job transition failed");
  }
  return result.rows[0];
}
export default {
  getJob,
  createJob,
  markAccepted,
  markQueued,
  markProcessing,
  markComplete,
  markFailed,
};
