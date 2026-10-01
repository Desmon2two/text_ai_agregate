export default async function markAttemptAndJobSucceded(attemptId, jobId) {
	await attemptRepository.markSucceded(attemptId);
	await jobRepository.markSucceded(jobId);
}
