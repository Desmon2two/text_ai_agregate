import { dbClient } from "../database/dbClient";
import handleFailure from "../infrastructure/failureHandler";
import mapErrorToAttemptError from "../infrastructure/utils/errorToProviderErrorMapper";
import mapJobToAiRequest from "../infrastructure/utils/JobToAiRequestMapper";

async function processJob(jobId: string) {
	await dbClient.query("BEGIN");
	try {
		const job = await jobRepository.claim(dbClient, jobId);
		const attempt = await attemptRepository.createAttempt({
			dbClient,
			jobId,
			provider: job.provider,
			model: job.model,
		});
		executeAttempt(dbClient, attempt.attemptId);
		await dbClient.query("COMMIT");
	} catch (error) {
		await dbClient.query("ROLLBACK");
		throw error;
	}
}
async function executeAttempt(dbClient, attemptId: string) {
	await dbClient.query("BEGIN");
	const attempt = await attemptRepository.getAttempt(dbClient, attemptId);
	try {
		const job = await jobRepository.getJob(dbClient, attempt.jobId);

		await attemptRepository.markSending(dbClient, attempt.id);
		const aiRequest = mapJobToAiRequest(job);
		const response = await aiProvider(dbClient, aiRequest);

		await attemptRepository.markReceived(dbClient, attempt.id, response);
		await validateAiResponse(response);
		await attemptRepository.markValidated(dbClient, attempt.id, response);
		await jobCompletionService.completeJob(
			dbClient,
			job.jobId,
			attempt.id,
			response.data,
		);
		await dbClient.query("COMMIT");
	} catch (error) {
		const attemptError = mapErrorToAttemptError(
			error,
			attempt.retryable,
			attempt.provider,
			attempt.code,
		);
		await handleFailure(dbClient, attempt, attemptError);
		await dbClient.query("ROLLBACK");
		throw error;
	}
}

export default {
	processJob,
	executeAttempt,
};
