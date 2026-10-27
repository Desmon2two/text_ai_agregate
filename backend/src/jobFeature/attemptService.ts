import type { Client } from "pg";
import type { Attempt } from "./types/AttemptTypes.js";
import jobRepository from "./jobRepository.js";
import attemptRepository from "./attemptRepository.js";
import { nonSecretVariables } from "../infrastructure/utils/nonSecretVariables.js";
import eventRepository from "./eventRepository.js";
import type { AttemptError } from "../errors/AttemptErrorType.js";

async function createAttempt(
  dbClient: Client,
  job_id: string,
  provider: string,
  model: string,
): Promise<Attempt> {
  const attempts = await jobRepository.getAttemptByIdsPerJob(dbClient, job_id);
  if (attempts === null) throw new Error("No attempts");
  const attemptNumber = attempts[0].attempt_number;
  if (attemptNumber >= nonSecretVariables.getMaxAttempts()) {
    throw new Error("Too many attempts for this job");
  }
  const attempt = await attemptRepository.createAttempt(
    dbClient,
    job_id,
    attemptNumber + 1,
    provider,
    model,
  );
  if (attempt === null) throw new Error("Attempt was not created");
  await eventRepository.createAttemptCreatedEvent(
    dbClient,
    attempt.attempt_id,
    { origin: "Regular attempt creation" },
  );
  return attempt;
}
async function markSending(dbClient: Client, attempt_id: string) {
  const attempt = await attemptRepository.getAttemptById(
    dbClient,
    attempt_id,
  );
  if (attempt?.state !== "CREATED")
    throw new Error(
      "Attempt not in 'CREATED' state to transition to 'SENDING' state",
    );
  const result = await attemptRepository.markSending(dbClient, attempt_id);
  if (result === null) {
    throw new Error("Attempt was not marked sending");
  }
  await eventRepository.createSendingRequestEvent(dbClient, attempt_id);
  return result.attempt_id;
}
async function markReceived(dbClient: Client, attempt_id: string, data: {
    tokens: {
      input_tokens: number;
      output_tokens: number;
    };
    received_data: unknown;
  }) {
    const attempt = await attemptRepository.getAttemptById(
    dbClient,
    attempt_id,
  );
  if (attempt?.state !== "SENDING")
    throw new Error(
      "Attempt not in 'SENDING' state to transition to 'RECEIVED' state",
    );
 
  const result = await attemptRepository.markReceived(dbClient, attempt_id, data);
  if (result === null) {
    throw new Error("Attempt was not marked received");
  }
  await eventRepository.createResponseReceivedEvent(dbClient, attempt_id);
  return result.attempt_id;
}
async function markValidated(dbClient: Client, attempt_id: string, data: {
    tokens: {
      input_tokens: number;
      output_tokens: number;
    };
    validated_data: unknown;
  }) {
    const attempt = await attemptRepository.getAttemptById(
    dbClient,
    attempt_id,
  );
  if (attempt?.state !== "RECEIVED")
    throw new Error(
      "Attempt not in 'RECEIVED' state to transition to 'VALIDATED' state",
    );
 if (!attempt?.data?.received_data){
    throw new Error("No received data to mark attempt validated")
  };
  if (!attempt?.data?.tokens.input_tokens || !attempt?.data?.tokens.output_tokens){
    throw new Error("No received tokens to mark attempt validated")
  };
  const result = await attemptRepository.markValidated(dbClient, attempt_id, data);
  if (result === null) {
    throw new Error("Attempt was not marked validated");
  }
  await eventRepository.createResponseValidatedEvent(dbClient, attempt_id);
  return result.attempt_id;
}
async function completeAttempt(
  dbClient: Client,
  attempt_id: string,
): Promise<Attempt> {
  const attempt = await attemptRepository.getAttemptById(dbClient, attempt_id);
  if (!attempt) throw new Error("Attempt not found");
  if (attempt.state !== "VALIDATED")
    throw new Error("Attempt not in validated state, unable to complete");
  if(!attempt.data?.validated_data) throw new Error("No validated data present on the attempt to mark it completed")
  const finalizedAttempt = await attemptRepository.markCompleted(
    dbClient,
    attempt_id,
  );
  if (!finalizedAttempt) throw new Error("Attempt was not marked complete");
  await eventRepository.createAttemptCompletedEvent(dbClient, attempt_id);
  return finalizedAttempt;
}
async function failAttempt(
  dbClient: Client,
  attempt_id: string,
  error: AttemptError,
): Promise<void> {
  const failedAttempt = await attemptRepository.getAttemptById(
    dbClient,
    attempt_id,
  );
  if (!failedAttempt) throw new Error("Attempt not found");
  if (failedAttempt.state === "COMPLETED")
    throw new Error("Attempt in completed state, unable to fail");
  await attemptRepository.markFailed(dbClient, attempt_id, error);
  await eventRepository.createAttemptFailedEvent(dbClient, attempt_id, {
    error: error,
  });
}
export default {
  createAttempt,
  markSending,
  markReceived,
  markValidated,
  completeAttempt,
  failAttempt,
};
