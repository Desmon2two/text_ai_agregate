import { Client } from "pg";
import handleFailure from "../infrastructure/failureHandler";
import mapErrorToAttemptError from "../infrastructure/utils/errorToProviderErrorMapper";
import mapJobToAiRequest from "../infrastructure/utils/JobToAiRequestMapper";
import jobRepository from "./jobRepository";
import attemptRepository from "./attemptRepository";
import attemptService from "./attemptService";
import eventRepository from "./eventRepository";
import jobService from "./jobService";
import { JobStateTypes } from "./types/JobStateType";

async function processJobFromBeginning(dbClient: Client, jobId: string) {
  try {
    await dbClient.query("BEGIN");
    const job = await jobRepository.markProcessing(dbClient, jobId);
    await eventRepository.createJobProcessingEvent(dbClient, jobId);
    const attempt = await attemptService.createAttempt({
      dbClient,
      jobId,
      provider: job.provider,
      model: job.model,
    });
    await eventRepository.createAttemptCreatedEvent(
      dbClient,
      attempt.attemptId,
      { origin: "Standart Job Processing" },
    );
    await dbClient.query("COMMIT");
    await executeAttempt(dbClient, attempt.attemptId);
  } catch (error) {
    await dbClient.query("ROLLBACK");
    throw error;
  }
}
async function processJobFromIntermediateState(
  dbClient: Client,
  jobId: string,
) {
  const job = await jobRepository.getJob(dbClient, jobId);
  if (job === null) {
    throw new Error("No such job to process from intermediate state");
  }
  try {
    await eventRepository.createJobProcessedFromIntermediateStateEvent(
      dbClient,
      job.jobId,
    );
    if (job.state === "CREATED") {
      await queueService.enqueue(dbClient, job.jobId);
    }
    if (job.state === "QUEUED") {
      await processJobFromBeginning(dbClient, job.jobId);
    }
    if (job.state === "PROCESSING") {
      const attempts = await jobRepository.getAttemptsPerJob(
        dbClient,
        job.jobId,
      );
      if (attempts === null || attempts.length === 0) {
        throw new Error("No such attempt to process from intermediate state");
      }
      await executeAttempt(dbClient, attempts[0].attemptId);
    }
  } catch (error) {
    throw error;
  }
}
async function executeAttempt(dbClient: Client, attemptid: string) {
  const attempt = await attemptRepository.getAttempt(dbClient, attemptid);
  if (attempt === null) {
    throw new Error("No such attempt");
  }
  const { attemptId, jobId, retryable, provider } = attempt;
  try {
    await dbClient.query("BEGIN");
    const job = await jobRepository.getJob(dbClient, jobId);
    if (job === null) {
      throw new Error("No such job");
    }

    try {
      await attemptRepository.markSending(dbClient, attemptId);
      await eventRepository.createSendingRequestEvent(dbClient, attemptId);
      await dbClient.query("COMMIT");
    } catch (error) {
      await dbClient.query("ROLLBACK");
    }
    const aiRequest = mapJobToAiRequest(job);
    const providerJobId = await aiProvider.send(dbClient, aiRequest);
    if (providerJobId !== null) {
      try {
        await dbClient.query("BEGIN");
        await attemptRepository.markWaiting(
          dbClient,
          attemptId,
          providerJobId,
        );
        await eventRepository.createWaitingForResponseEvent(
          dbClient,
          attemptId,
          { providerJobId },
        );
        await dbClient.query("COMMIT");
      } catch (error) {
        await dbClient.query("ROLLBACK");
      }
    }
    const response = await aiProvider.receive(dbClient, aiRequest);
    try {
      await dbClient.query("BEGIN");
      await attemptRepository.markReceived(dbClient, attemptId, response);
      await eventRepository.createResponseReceivedEvent(dbClient, attemptId);
      await dbClient.query("COMMIT");
    } catch (error) {
      await dbClient.query("ROLLBACK");
    }
    await validateAiResponse(response);
    try {
      await dbClient.query("BEGIN");
      await attemptRepository.markValidated(dbClient, attemptId, response);
      await eventRepository.createResponseValidatedEvent(dbClient, attemptId);
      await dbClient.query("COMMIT");
    } catch (error) {
      await dbClient.query("ROLLBACK");
    }
    await jobService.completeJob(dbClient, job.jobId, attemptId);
  } catch (error) {
    const attemptError = mapErrorToAttemptError(
      error,
      retryable,
      provider,
      error.code,
    );
    await handleFailure(dbClient, attemptId, attemptError);
    throw error;
  }
}

export default {
  processJobFromBeginning,
  processJobFromIntermediateState,
  executeAttempt,
};
