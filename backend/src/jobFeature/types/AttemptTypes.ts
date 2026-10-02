import { AttemptsState } from "./AttemptsStateType";
import {Client} from "pg"

type Attempt = {
  jobId: string;
  attemptId: string;
  attemptNumber: number;
  state: AttemptsState;
  provider: string;
  model: string;
  data?: unknown;
  error?: unknown;
  providerOperationId?: string;
  createdAt: Date;
  startedAt?: Date;
  updatedAt: Date;
  completedAt?: Date;
  lastHeartbeatAt?: Date;
};
type CreateAttemptInput = {
  dbClient: Client;
  jobId: string;
  attemptNumber: number;
  provider: string;
  model: string;
};
export { Attempt, CreateAttemptInput };
