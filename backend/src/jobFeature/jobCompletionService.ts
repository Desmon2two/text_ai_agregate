import { completeJobType } from "./types/JobTypes";

async function completeJob({jobId, attemptId, data}: completeJobType): Promise<void>{
const job = jobRepository.getJob(jobId)
if (job.state !== "processing") throw new Error("Job is not in processing state")
const attempt = attemptRepository.getAttempt(attemptId)
if (attempt.state !== "validated") throw new Error("Attempt is not in validated state")

 await markAttemptAndJobSucceded(jobId, attemptId);
 await jobRepository.writeResult(data);
return
}
export default {
    completeJob
}