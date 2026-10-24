import type { Job } from "./types/JobTypes.js";
import attemptRepository from "./attemptRepository.js";
import jobRepository from "./jobRepository.js";
import eventRepository from "./eventRepository.js";
import { Client } from "pg";
import { mapTokensToActualCost } from "../FinancesFeature/finService.js";
import { JobStateTypes } from "./types/JobStateType.js";

async function createJob(
  dbClient: Client,
  type: JobStateTypes,
  estimated_cost: number,
  user_id: string,
  body: { prompt: string; [keys?: any] },
  filesUrl?: string,
): Promise<Job> {
  const job = await jobRepository.createJob(
    dbClient,
    user_id,
    type,
    body,
    estimated_cost,
  );
  if (job === null) throw new Error("Job was not created");
  await eventRepository.createJobAcceptedEvent(dbClient, job.job_id);
  return job;
}

async function completeJob(
  dbClient: Client,
  job_id: string,
  validated_data: unknown,
  fullPrice: number,
): Promise<Job> {
  const jobResult = await jobRepository.markCompleted(
    dbClient,
    job_id,
    validated_data,
    fullPrice,
  );
  if (jobResult === null)
    throw Error("Complete job operation failed at mark job completed");
  await eventRepository.createJobCompletedEvent(dbClient, job_id);
  return jobResult;
}

export default {
  createJob,
  completeJob,
};
