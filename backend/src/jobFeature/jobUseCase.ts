import { CommitJobInput, CommitJobOutput } from "./types/JobTypes";

async function createJob({ planId }: CommitJobInput): Promise<CommitJobOutput> {
	// authorization checks
// 
	// We need to create a planId, even if it's the first commit by the user
	// Also we need to check if there is already a planId for this user
	// If there is , we need to use that planId, if there isn't we need to create a new one
//  If there is we also need to check how fresh it is, to not accidentally use a planId that is too old
// Atomically create a job
	validateJobRequest();
	const estimatedCost = costService.estimateCost();
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

async function commitJob({ userId, jobTypeId, model, body, files }) {}

export default {
	createJob,
	planJob,
};
