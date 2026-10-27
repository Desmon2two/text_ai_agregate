import type { PostgreSQLResponse } from "../database/types/databaseResultTypes.js";
import type { AttemptError } from "../errors/AttemptErrorType.js";
import type { Attempt, CreateAttemptInput } from "./types/AttemptTypes.js";
import type { Client } from "pg";
async function getAttemptById(
  dbClient: Client,
  attempt_id: string,
): Promise<Attempt | null> {
  const result = await dbClient.query(
    `SELECT * FROM attempts
      WHERE attempt_id = $1
      `,
    [attempt_id],
  );
  if (!result.rows[0]) return null;
  return result.rows[0];
}
async function createAttempt(
  dbClient: Client,
  job_id: string,
  attempt_number: number,
  provider: string,
  model: string,
): Promise<Attempt | null> {
  const result = await dbClient.query(
    `INSERT INTO attempts(state, job_id, attempt_number, provider, model) 
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
    `,
    ["CREATED", job_id, attempt_number, provider, model],
  );
  if (!result.rows[0]) return null;
  return result.rows[0];
}
async function deleteAttempt(
  dbClient: Client,
  attempt_id: string,
): Promise<PostgreSQLResponse> {
  const result = await dbClient.query(
    `DELETE FROM attempts WHERE attempt_id = $1
    `,
    [attempt_id],
  );
  return result;
}
async function markSending(
  dbClient: Client,
  attempt_id: string,
): Promise<Attempt | null> {
  const result = await dbClient.query(
    `UPDATE attempts
    SET state = $3, updated_at = NOW()
    WHERE attempt_id = $1
    AND state = $2
    RETURNING *
    `,
    [attempt_id, "CREATED", "SENDING"],
  );
  if (!result.rows[0]) return null;
  return result.rows[0];
}
// async function markWaiting(
//   dbClient: Client,
//   attempt_id: string,
//   providerJobId?: string,
// ) {
//   const result = await dbClient.query(
//     `UPDATE attempts
//     SET state = $3, provider_job_id = $4, updated_at = NOW()
//     WHERE attempt_id = $1
//     AND state = $2
//     RETURNING *
//     `,
//     [attempt_id, "SENDING", "WAITING", providerJobId || null],
//   );
//   if (!result.rows[0]) return null;
//   return result.rows[0];
// }
async function markReceived(
  dbClient: Client,
  attempt_id: string,
  data: {
    tokens: {
      input_tokens: number;
      output_tokens: number;
    };
    received_data: unknown;
  },
) {
  const result = await dbClient.query(
    `UPDATE attempts
    SET state = $3, data = $4, updated_at = NOW()
    WHERE attempt_id = $1
    AND state = $2
    RETURNING *
    `,
    [attempt_id, "SENDING", "RECEIVED", data],
  );
  if (!result.rows[0]) return null;
  return result.rows[0];
}
async function markValidated(
  dbClient: Client,
  attempt_id: string,
  data: {

    tokens: {
      input_tokens: number;
      output_tokens: number;
    };
    validated_data: unknown;
  }
) {
  if (data === null || !data)
    throw new Error("Data can't be null while validating attempt");
  const result = await dbClient.query(
    `UPDATE attempts
    SET state = $3, data = $4, updated_at = NOW()
    WHERE attempt_id = $1
    AND state = $2
    RETURNING *
    `,
    [attempt_id, "RECEIVED", "VALIDATED", data],
  );
  if (!result.rows[0]) return null;
  return result.rows[0];
}
async function markCompleted(
  dbClient: Client,
  attempt_id: string,
): Promise<Attempt | null> {
  const result = await dbClient.query(
    `UPDATE attempts
    SET state = $3, updated_at = NOW(), completed_at = NOW()
    WHERE attempt_id = $1
    AND state = $2
    RETURNING *
    `,
    [attempt_id, "VALIDATED", "COMPLETED"],
  );
  if (!result.rows[0]) return null;
  return result.rows[0];
}
async function markFailed(
  dbClient: Client,
  attempt_id: string,
  error: AttemptError,
) {
  const result = await dbClient.query(
    `UPDATE attempts
    SET state = $2, error = $3, updated_at = NOW()
    WHERE attempt_id = $1
    AND state IN ('CREATED', 'SENDING', 'WAITING', 'RECEIVED', 'VALIDATED')
    RETURNING *
    `,
    [attempt_id, "FAILED", error],
  );
  if (!result.rows[0]) return null;
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
