import type { AttemptsState } from "./AttemptsStateType.js";
import { Client } from "pg";
/* 
The db tables are a source of truth for jobs, attempts, and events
*/
type Attempt = {
  job_id: string;
  attempt_id: string;
  attemptNumber: number;
  state: AttemptsState;
  provider: string;
  model: string;
  data?: unknown;
  error?: unknown;
  retryable?: false;
  providerOperationId?: string;
  createdAt: Date;
  startedAt?: Date;
  updatedAt: Date;
  completedAt?: Date;
  lastHeartbeatAt?: Date;
  recoveryLeaseUntil?: Date;
  recoveryWorkerId?: string;
};
type CreateAttemptInput = {
  dbClient: Client;
  job_id: string;
  attemptNumber: number;
  provider: string;
  model: string;
};
export type { Attempt, CreateAttemptInput };
