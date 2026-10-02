import { completeJobType } from "./types/JobTypes";
import {dbClient} from "../database/dbClient"

async function completeJob({jobId, attemptId, data}: completeJobType): Promise<void>{
const job = jobRepository.getJob(dbClient, jobId)
if (job.state !== "processing") throw new Error("Job is not in processing state")
const attempt = attemptRepository.getAttempt(dbClient, attemptId)
if (attempt.state !== "validated") throw new Error("Attempt is not in validated state")

 await markAttemptAndJobSucceded(dbClient, jobId, attemptId);
 await jobRepository.writeResult(dbClient, data);
return
}
export default {
    completeJob
}