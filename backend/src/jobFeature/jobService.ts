import type { Job, JobTypes } from "./types/JobTypes.js";
import jobRepository from "./jobRepository.js";
import eventRepository from "./eventRepository.js";
import type { Client } from "pg";
import type { JobStateTypes } from "./types/JobStateTypes.js";

async function createJob(
  dbClient: Client,
  type: JobTypes,
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
async function markQueued(dbClient: Client, job_id: string){
  const job = await jobRepository.markQueued(dbClient, job_id);
  if(job === null) {
throw new Error("Job was not marked queued")
  }
    await eventRepository.createJobQueuedEvent(dbClient, job_id);
return job.job_id
}
async function markProcessing(dbClient: Client, job_id: string){
  const job = await jobRepository.markProcessing(dbClient, job_id);
  if(job === null) {
throw new Error("Job was not marked processing")
  }
    await eventRepository.createJobProcessingEvent(dbClient, job_id);
return job.job_id
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
  markProcessing,
markQueued,

  completeJob,
};
