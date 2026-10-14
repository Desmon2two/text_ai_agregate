import { AttemptsState } from "./AttemptsStateType";
import {Client} from "pg"
/* 
The db tables are a source of truth for jobs, attempts, and events
*/
type Attempt = {
  jobId: string;
  attemptId: string;
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
  recoveryLeaseUntil: Date;
  recoveryWorkerId: string;
};
type CreateAttemptInput = {
  dbClient: Client;
  jobId: string;
  provider: string;
  model: string;
};
export { Attempt, CreateAttemptInput };
