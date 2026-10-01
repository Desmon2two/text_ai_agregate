export default async function markAttemptAndJobFailed(attemptId, jobId){
   await attemptRepository.markFailed(attemptId);
		await jobRepository.markFailed(jobId);
}