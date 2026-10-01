import { Attempt, CreateAttemptInput } from "./types/AttemptTypes";

async function createAttempt({
	jobId,
	provider,
	model,
}: CreateAttemptInput): Promise<Attempt> {
	let attempts = await attemptRepository.attemptsByJobId(jobId);
	if (attempts >= 2) throw new Error("Too many attempts for this job");
	const attempt = await attemptRepository.create({
		jobId,
		attemptNumber: attempts + 1,
		provider,
		model,
	});
	return attempt;
}

async function failAttempt(attemptId: string): Promise<string | null> {
	const failedAttempt = await attemptRepository.findById(attemptId);
	if (!failedAttempt) throw new Error("Attempt not found");
	await attemptRepository.markFailed(attemptId);
	let attempts = await attemptRepository.attemptsByJobId(jobId);
	if (attempts >= MAX_ATTEMPTS) return null;
	const retry = await createAttempt({
		jobId: failedAttempt.jobId,
		provider: failedAttempt.provider,
		model: failedAttempt.model,
	});

	return retry.attemptId;
}

export default {
	createAttempt,
};
