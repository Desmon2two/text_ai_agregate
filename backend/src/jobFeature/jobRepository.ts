import type { Client } from "pg";
import type { Job } from "./types/JobTypes.js";
import type { Attempt } from "./types/AttemptTypes.js";
import type { PostgreSQLResponse } from "../database/types/databaseResultTypes.js";
import type { JobStateTypes } from "./types/JobStateTypes.js";
async function getJobById(
  dbClient: Client,
  job_id: string,
): Promise<Job | null> {
  const result = await dbClient.query(
    `
    SELECT * FROM jobs 
    WHERE job_id = $1
    `,
    [job_id],
  );
  if (!result.rows[0]) return null;
  return result.rows[0];
}
async function getAttemptsPerJob(
  dbClient: Client,
  job_id: string,
): Promise<Attempt[] | null> {
  const result = await dbClient.query(
    `
    SELECT * FROM attempts 
    WHERE job_id = $1
    ORDER BY attempt_number DESC
    `,
    [job_id],
  );
  if (result.rows.length === 0) return null;
  return result.rows;
}
async function createJob(
  dbClient: Client,
  user_id: string,
  type: JobStateTypes,
  body: unknown,
  estimated_cost: number,
): Promise<Job | null> {
  const result = await dbClient.query(
    `
    INSERT INTO jobs (state, type, body, user_id, estimated_cost)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
    `,
    ["CREATED", type, body, user_id, estimated_cost],
  );
  if (!result.rows[0]) return null;
  return result.rows[0];
}
async function deleteJob(
  dbClient: Client,
  job_id: string,
): Promise<PostgreSQLResponse | null> {
  const result = await dbClient.query(
    `
    DELETE FROM jobs WHERE job_id = $1
    `,
    [job_id],
  );
  if (!result) return null;
  return result;
}
async function markAccepted(
  dbClient: Client,
  job_id: string,
): Promise<Job | null> {
  const result = await dbClient.query(
    `UPDATE jobs
    SET state = $3, updated_at = NOW()
    WHERE job_id = $1
    AND state = $2
    RETURNING *
    `,
    [job_id, "CREATED", "ACCEPTED"],
  );
  if (!result.rows[0]) return null;
  return result.rows[0];
}
async function markQueued(
  dbClient: Client,
  job_id: string,
): Promise<Job | null> {
  const result = await dbClient.query(
    `UPDATE jobs
    SET state = $3, updated_at = NOW()
    WHERE job_id = $1
    AND state = $2
    RETURNING *
    `,
    [job_id, "ACCEPTED", "QUEUED"],
  );
  if (!result.rows[0]) return null;
  return result.rows[0];
}
async function markProcessing(
  dbClient: Client,
  job_id: string,
): Promise<Job | null> {
  const result = await dbClient.query(
    `UPDATE jobs
    SET state = $3, updated_at = NOW()
    WHERE job_id = $1
    AND state = $2
    RETURNING *
    `,
    [job_id, "QUEUED", "PROCESSING"],
  );
  console.log(result)
  if (!result.rows[0]) return null;
  return result.rows[0];
}
async function markCompleted(
  dbClient: Client,
  job_id: string,
  data: unknown,
  actual_cost: number,
): Promise<Job | null> {
  if (!data || data === null) throw new Error("Data can't be empty");
  if (!actual_cost || actual_cost === null)
    throw new Error("Actual cost can't be empty");
  const result = await dbClient.query(
    `UPDATE jobs
    SET state = $3, data = $4, actual_cost = $5, updated_at = NOW(), completed_at = NOW()
    WHERE job_id = $1
    AND state = $2
    RETURNING *
    `,
    [job_id, "PROCESSING", "COMPLETED", data, actual_cost],
  );
  if (!result.rows[0]) return null;
  return result.rows[0];
}
async function markFailed(
  dbClient: Client,
  job_id: string,
  error: unknown,
): Promise<Job | null> {
  const result = await dbClient.query(
    `UPDATE jobs
    SET state = $2, error = $3, updated_at = NOW()
    WHERE job_id = $1
    AND state = ('CREATED', 'ACCEPTED', 'QUEUED', 'PROCESSING')
    RETURNING *
    `,
    [job_id, "FAILED", error],
  );
  if (!result.rows[0]) return null;
  return result.rows[0];
}
export default {
  getJobById,
  deleteJob,
  getAttemptsPerJob,
  createJob,
  markAccepted,
  markQueued,
  markProcessing,
  markCompleted,
  markFailed,
};
