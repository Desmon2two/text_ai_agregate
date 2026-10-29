export type DispatchWorkerInputData = {
  dbClient: Client;
  job_id: string;
  attempt_id: string;
};
export type RecoveryWorkerInputData = {
  dbClient: Client;
  job_id: string;
  attempt_id: string;
  provider: string;
  model: string;
};
