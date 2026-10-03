import { RecoveryStates } from "./RecoveryStatesType";

export type RecoveryTask = {
  state: RecoveryStates;
  attemptId: string;
  recoveryAttempts: number;
  maxRecoveryAttempts: number;
  metadata: unknown;
};
