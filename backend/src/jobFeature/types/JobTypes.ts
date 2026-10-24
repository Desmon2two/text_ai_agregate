import { Client } from "pg";
import type { JobStateTypes } from "./JobStateType.js";

/* 
The db tables are a source of truth for jobs, attempts, and events
*/
type Job = {
  user_id: string;
  job_id: string;
  state: JobStateTypes;
  type: string;
  body?: unknown;
  files?: string[];
  error?: unknown;
  data?: unknown;
  metadata?: unknown;
  recovery_worker_id?: string;
  recovery_lease_until?: Date;
  estimated_cost: number;
  actual_cost?: number;
  created_at?: Date;
};
type CreateJob = {
  dbClient: Client;
  user_id: string;
  type: string;
  body: unknown;
  estimated_cost: number;
};
type CreateJobOutput = {
  job_id: string;
  attempt_id: string;
};

type completeJobType = {
  dbClient: Client;
  job_id: string;
  attempt_id: string;
};
export type { Job, CreateJob, CreateJobOutput, completeJobType };
