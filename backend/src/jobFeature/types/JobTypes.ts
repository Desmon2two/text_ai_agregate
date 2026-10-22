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
  body: unknown;
  files?: string[];
  error?: unknown;
  data?: unknown;
  metadata?: unknown;
  recovery_workerId?: string;
  recovery_lease_until?: Date;
  estimated_cost: number;
  actual_cost?: number;
  created_at: Date;
};
type CreateJob = {
  dbClient: Client;
  userId: string;
  type: string;
  body: unknown;
  estimatedCost: number;
};
type CommitJobOutput = {
  jobId: string;
  createdAt: Date;
};

type completeJobType = {
  dbClient: Client;
  jobId: string;
  attemptId: string;
};
export type { Job, CreateJob, CommitJobOutput, completeJobType };
