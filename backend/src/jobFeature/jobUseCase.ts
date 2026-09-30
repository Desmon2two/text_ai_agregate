import mapJobToAiRequest from "../infrastructure/utils/JobToAiRequestMapper";
import { CommitJobInput, CommitJobOutput } from "./types/JobTypes";

async function createJob({ body, files, provider, model, jobType }: CommitJobInput): Promise<CommitJobOutput> {
	// authorization checks - check if user is subscribed, is his credits allow the operaton
	// is the provider and model is in our supported list? Is the model enabled?
// We check the plan that user gave us, validate it (check critical fields)
// Calculate or verify cost
// Atomically create a job and return jobId

	validateJobRequest();
	const estimatedCost = finService.estimateCost();
	const result = await jobService.createJob({
		userId,
		jobTypeId,
		body,
		files,
	});
	return {
		jobId: result.jobId,
		createdAt: result.createdAt,
	};
}

async function planJob({ userid, jobTypeId, body, files }) {
	return {
		jobType,
		provider,
		model,
		estimatedCost,
		interpretedIntent,
		executionConfiguration,
	};
}

async function commitJob(userId: string, { jobType, provider, model, body, files }: CommitJobInput): CommitJobOutput {
	const isAllowed = userService.checkUser();
	if (!isAllowed) throw new UnauthorizedError("User is not allowed");
	const aiRequest = mapJobToAiRequest({jobType, provider, model, body, files});
	const attempt = 
	return {
		jobId: ,
		createdAt: ,
	}
}

export default {
	createJob,
	planJob,
};
