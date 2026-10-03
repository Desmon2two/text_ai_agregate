import { AttemptError } from "../errors/AttemptErrorType";
import { Attempt, CreateAttemptInput } from "./types/AttemptTypes";
import { Client } from "pg";
async function getAttempt(dbClient: Client, attemptId: string): Promise<Attempt | null> {
  const result = await dbClient.query(
    `SELECT * FROM attempts
      WHERE attempt_id = $1
      `,
    [attemptId],
  );
  return result.rows[0];
}
async function createAttempt({
  dbClient,
  jobId,
  attemptNumber,
  provider,
  model,
}: CreateAttemptInput) {
  const result = await dbClient.query(
    `INSERT INTO attempts(state, job_id, attempt_number, provider, model) 
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
    `,
    ["CREATED", jobId, attemptNumber, provider, model],
  );
  return result.rows[0];
}
async function markSending(dbClient: Client, attemptId: string) {
  const result = await dbClient.query(
    `UPDATE attempts
    SET state = $3, updated_at = NOW()
    WHERE attempt_id = $1
    AND state = $2
    RETURNING *
    `,
    [attemptId, "CREATED", "SENDING"],
  );
  return result.rows[0];
}
async function markWaiting(
  dbClient: Client,
  attemptId: string,
  providerJobId?: string,
) {
  const result = await dbClient.query(
    `UPDATE attempts
    SET state = $3, provider_job_id = $4, updated_at = NOW()
    WHERE attempt_id = $1
    AND state = $2
    RETURNING *
    `,
    [attemptId, "SENDING", "WAITING", providerJobId || null],
  );
  return result.rows[0];
}
async function markReceived(
  dbClient: Client,
  attemptId: string,
  data: unknown,
) {
  const result = await dbClient.query(
    `UPDATE attempts
    SET state = $3, data = $4, updated_at = NOW()
    WHERE attempt_id = $1
    AND state = $2
    RETURNING *
    `,
    [attemptId, "WAITING", "RECEIVED", data],
  );
  return result.rows[0];
}
async function markValidated(
  dbClient: Client,
  attemptId: string,
  data: unknown,
) {
  const result = await dbClient.query(
    `UPDATE attempts
    SET state = $3, data = $4, updated_at = NOW()
    WHERE attempt_id = $1
    AND state = $2
    RETURNING *
    `,
    [attemptId, "RECEIVED", "VALIDATED", data],
  );
  return result.rows[0];
}
async function markCompleted(
  dbClient: Client,
  attemptId: string,
  data: unknown,
) {
  const result = await dbClient.query(
    `UPDATE attempts
    SET state = $3, data = $4, updated_at = NOW(), completed_at = NOW()
    WHERE attempt_id = $1
    AND state = $2
    RETURNING *
    `,
    [attemptId, "VALIDATED", "COMPLETED", data],
  );
  return result.rows[0];
}
async function markFailed(
  dbClient: Client,
  attemptId: string,
  error: AttemptError,
) {
  const result = await dbClient.query(
    `UPDATE attempts
    SET state = $2, error = $3, updated_at = NOW()
    WHERE attempt_id = $1
    AND state IN ('CREATED', 'SENDING', 'WAITING', 'RECEIVED', 'VALIDATED')
    RETURNING *
    `,
    [attemptId, "FAILED", error],
  );
  return result.rows[0];
}
export default {
  getAttempt,
  createAttempt,
  markSending,
  markWaiting,
  markReceived,
  markValidated,
  markCompleted,
  markFailed,
};
