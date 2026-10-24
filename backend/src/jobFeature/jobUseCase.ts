import { NotFoundError } from "../errors/applicationErrors.js";
import {
  estimateCost,
  mapTokensToActualCost,
  reserveCredits,
} from "../FinancesFeature/finService.js";
import finUseCase from "../FinancesFeature/finUseCase.js";
import jobService from "../jobFeature/jobService.js";
import queueService from "../queue/queueService.js";
import userRepository from "../userFeature/userRepository.js";
import attemptService from "./attemptService.js";
import jobRepository from "./jobRepository.js";

async function startJob(
  dbClient: Client,
  user_id: string,
  provider: string,
  model: string,
  job_type: string,
  body: { prompt: string },
  files?: string,
) {
  if (!body.prompt) throw new Error("No prompt to process job");
  if (body.prompt.length === 0)
    throw new Error("Invalid prompt to process job");
  const user = await userRepository.getUserById(dbClient, user_id);
  if (!user) throw new NotFoundError("User not found");
  dbClient.query("BEGIN");
  try {
    const { fullPrice } = await estimateCost(
      dbClient,
      body.prompt,
      job_type,
      model,
    );
    await reserveCredits(dbClient, user.user_id, fullPrice);
    const { job_id } = await jobService.createJob(
      dbClient,
      job_type,
      fullPrice,
      user.user_id,
      body,
      files,
    );
    const { attempt_id } = await attemptService.createAttempt(
      dbClient,
      job_id,
      provider,
      model,
    );
    dbClient.query("COMMIT");
    await queueService.addJobToDispatchQueue(undefined, { job_id, attempt_id });
    return {
      job_id,
      attempt_id,
    };
  } catch (error) {
    dbClient.query("ROLLBACK");
    throw error;
  }
}
async function completeJob(
  dbClient: Client,
  job_id: string,
  attempt_id: string,
  data: {
    tokens: { input_tokens: number; output_tokens: number };
    received_data: unknown;
  },
): Promise<void> {
  const job = await jobRepository.getJobById(dbClient, job_id);
  if (job === null) throw new Error("No such job for completeJob");
  if (job.state !== "PROCESSING")
    throw new Error("Job is not in processing state");
  const attempt = await attemptService.completeAttempt(
    dbClient,
    attempt_id,
    data,
  );
  const { fullPrice } = await mapTokensToActualCost(
    dbClient,
    attempt.model,
    attempt.data.tokens.input_tokens,
    attempt.data.tokens.output_tokens,
  );
  const finalizedJob = await jobService.completeJob(
    dbClient,
    job_id,
    attempt.data?.received_data,
    fullPrice,
  );
  await finUseCase.changeCreditsOnJobCompletion(dbClient, finalizedJob.job_id);
  return;
}

export default {
  startJob,
  completeJob,
};
