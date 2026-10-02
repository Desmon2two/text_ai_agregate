import { AttemptError } from "../errors/AttemptErrorType";
import { Attempt } from "./types/AttemptTypes";
import {Client} from "pg"
async function getAttempt(dbClient: Client, attemptId: string){
try {
    const result = await dbClient.query(
      `SELECT * FROM attempts 
      WHERE attempt_id = $1
      `,
      [attemptId]);
  return result.rows[0]
} catch (error) {
  throw new Error("Could not get the attempt");
}
}
async function markCreated(dbClient: Client, attempt: Attempt) {
	const result = await dbClient.query(
		`INSERT INTO attempts(status, job_id, attempt_number, provider, model) 
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
    `,
		[
			attempt.status.state,
			attempt.jobId,
			attempt.attemptNumber,
			attempt.provider,
			attempt.model,
		],
	);
  return result.rows[0]
}
async function markSending(dbClient: Client, attemptId: string) {}
async function markWaiting(dbClient: Client, attemptId: string, providerJobId: string) {}
async function markReceived(dbClient: Client, attemptId: string, data: unknown) {}
async function markValidated(dbClient: Client, attemptId: string, data: unknown) {}
async function markComplete(dbClient: Client, attemptId: string, data: unknown) {}
async function markFailed(dbClient: Client, attemptId: string, error: AttemptError) {}
export default {
  getAttempt,
  markCreated,
  markSending,
  markWaiting,
  markReceived,
  markValidated,
  markComplete,
  markFailed,
};
