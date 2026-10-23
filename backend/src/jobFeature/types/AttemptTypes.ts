import type { AttemptsState } from "./AttemptsStateType.js";
import { Client } from "pg";
/* 
The db tables are a source of truth for jobs, attempts, and events
*/
type Attempt = {
  job_id: string;
  attempt_id: string;
  attempt_number: number;
  state: AttemptsState;
  provider: string;
  model: string;
  data?: {
    tokens: { input_tokens: number; output_tokens: number };
    received_data: unknown;
  };
  error?: unknown;
  retryable?: false;
  provider_operation_id?: string;
  created_at?: Date;
  started_at?: Date;
  updated_at?: Date;
  completed_at?: Date;
  lastHeartbeat_at?: Date;
  recovery_lease_until?: Date;
  recovery_worker_id?: string;
};
type CreateAttemptInput = {
  dbClient: Client;
  job_id: string;
  attempt_number: number;
  provider: string;
  model: string;
};
export type { Attempt, CreateAttemptInput };
