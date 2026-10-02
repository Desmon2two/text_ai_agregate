import { AttemptsState } from "./AttemptsStateType";
import {Client} from "pg"

type Attempt = {
  state: AttemptsState;
  data?: unknown;
  error?: unknown;
  jobId: string;
  attemptId: string;
  attemptNumber: number;
  provider: string;
  model: string;
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
  provider: string;
  model: string;
};
export { Attempt, CreateAttemptInput };
