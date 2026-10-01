import { AttemptError } from "../errors/AttemptErrorType";
import attemptService from "../jobFeature/attemptService";
import { Attempt } from "../jobFeature/types/AttemptTypes";

export default async function handleFailure(
	attempt: Attempt,
	error: AttemptError,
): Promise<string | null> {
	await attemptRepository.markFailed(attempt.attemptId, error);
	if (!error.retryable) {
		await jobRepository.markFailed(attempt.jobId);
		return null;
	}
	if (attempt.attemptNumber >= MAX_ATTEMPTS) {
		await jobRepository.markFailed(attempt.jobId);
		await eventRepository.createEvent({
			name: "ATTEMPT_FAILED",
			reason: "MAX_ATTEMPTS_REACHED",
		});
		await eventRepository.createEvent({
			name: "JOB_FAILED",
			reason: "MAX_ATTEMPTS_REACHED",
		});
		return null;
	}
	const newAttempt = await attemptService.createAttempt({
		jobId: attempt.jobId,
		provider: attempt.provider,
		model: attempt.model,
	});
	await eventRepository.createEvent({
		name: "RETRY_CREATED",
		metadata: {
			attemptId: newAttempt.attemptId,
			previousAttemptId: attempt.attemptId,
		},
	});
	return newAttempt.attemptId;
}
