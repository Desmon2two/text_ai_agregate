import { Client } from "pg";
import { dbClient } from "../database/dbClient";
import { Attempt, CreateAttemptInput } from "./types/AttemptTypes";
import jobRepository from "./jobRepository";
import attemptRepository from "./attemptRepository";
import nonSecretVariables from "../infrastructure/utils/nonSecretVariables";
import eventRepository from "./eventRepository";
import { AttemptError } from "../errors/AttemptErrorType";

async function createAttempt({
  dbClient,
  jobId,
  provider,
  model,
}: CreateAttemptInput): Promise<Attempt> {
  await dbClient.query("BEGIN");
  try {
    let attempts = await jobRepository.getAttemptsPerJob(dbClient , jobId);
    if (attempts >= nonSecretVariables.MAX_ATTEMPTS) {
      throw new Error("Too many attempts for this job");
    }
    const attempt = await attemptRepository.createAttempt({
      dbClient,
      jobId,
      attemptNumber: attempts + 1,
      provider,
      model,
    });
    if (attempt === null) throw new Error("Attempt was not created")
    await dbClient.query("COMMIT");
    return attempt;
  } catch (error) {
    await dbClient.query("ROLLBACK");
    throw error;
  } 
}
async function completeAttempt(dbClient: Client, attemptId: string, data: unknown): Promise<void>{
try {
    await dbClient.query("BEGIN")
    await attemptRepository.markCompleted(dbClient, attemptId, data);
    await eventRepository.createAttemptCompletedEvent(dbClient, attemptId)
    await dbClient.query("COMMIT")
  } catch (error) {
    await dbClient.query("ROLLBACK")
    throw error
}
}
async function failAttempt(attemptId: string, error: AttemptError): Promise<void> {
  const failedAttempt = await attemptRepository.getAttempt(dbClient, attemptId);
  if (!failedAttempt) throw new Error("Attempt not found");
  await dbClient.query("BEGIN");
  try {
    await attemptRepository.markFailed(dbClient, attemptId, error);
    await eventRepository.createAttemptFailedEvent(dbClient, attemptId, {error: error})
    await dbClient.query("COMMIT");
  } catch (error) {
    await dbClient.query("ROLLBACK");
    throw error;
  } 
}
export default {
  createAttempt,
  completeAttempt,
  failAttempt,
};
