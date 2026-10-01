import handleFailure from "../infrastructure/failureHandler";
import mapErrorToAttemptError from "../infrastructure/utils/errorToProviderErrorMapper";
import mapJobToAiRequest from "../infrastructure/utils/JobToAiRequestMapper";

async function processJob(jobId: string) {
	const job = await jobRepository.claim(jobId);

	const attempt = await attemptRepository.createAttempt({
		jobId,
		provider: job.provider,
		model: job.model,
	});

	try {
		await attemptRepository.markSending(attempt.id);
		const aiRequest = mapJobToAiRequest(job);
		const response = await aiProvider(aiRequest);
	
		await attemptRepository.markReceived(attempt.id, response);
		await validateAiResponse(response)
		await attemptRepository.markValidated(attempt.id, response)
		await jobCompletionService.completeJob(jobId, attempt.id, response.data); // With attempt and job completion atomically
	} catch (error) {
		const attemptError = mapErrorToAttemptError(error, attempt.retryable, attempt.provider, attempt.code);
		await handleFailure(attempt, attemptError);

		const success = await handleFailure(attempt, error)
		}
	
}
