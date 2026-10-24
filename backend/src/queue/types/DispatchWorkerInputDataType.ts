export type DispatchWorkerInputData = {
    dbClient: Client,
    job_id: string,
    attempt_id: string,
}