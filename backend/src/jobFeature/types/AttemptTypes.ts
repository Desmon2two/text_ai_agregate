import { AttemptsStateMachine } from "./AttemptsStateMachineType";

type Attempt = {
  status: AttemptsStateMachine;
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
  dbClient;
  jobId: string;
  provider: string;
  model: string;
};
export { Attempt, CreateAttemptInput };
