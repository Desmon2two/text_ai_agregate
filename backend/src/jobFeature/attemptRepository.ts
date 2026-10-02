import { AttemptError } from "../errors/AttemptErrorType";
import { Attempt } from "./types/AttemptTypes";

async function markCreated(dbClient, attempt: Attempt) {
  await dbClient.query(
    `INSERT INTO attempts(status, jobId, attemptNumber, provider, model) VALUES ("${attempt.status.state}", "${attempt.jobId}", "${attempt.attemptNumber}", "${attempt.provider}", "${attempt.model}")`,
  );
}
async function markSending(dbClient, attemptId) {}
async function markWaiting(dbClient, attemptId, providerJobId) {}
async function markReceived(dbClient, attemptId, data) {}
async function markValidated(dbClient, attemptId, data) {}
async function markComplete(dbClient, attemptId, data) {}
async function markFailed(dbClient, attemptId, error: AttemptError) {}
export default {
  markCreated,
  markSending,
  markWaiting,
  markReceived,
  markValidated,
  markComplete,
  markFailed,
};
