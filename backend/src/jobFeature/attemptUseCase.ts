import { Attempt, CreateAttemptInput } from "./types/AttemptTypes";

async function createAttempt({
	jobId,
	provider,
	model,
}: CreateAttemptInput): Promise<Attempt> {
	const attempts = await attemptRepository.countByJobId(jobId);
	if (attempts >= 2) throw new Error("Too many attempts for this job");
	const attempt = await attemptRepository.create({
		jobId,
		provider,
		model,
	});
	return attempt;
}

export default {
	createAttempt,
};
