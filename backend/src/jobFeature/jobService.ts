import mapJobToAiRequest from "../infrastructure/utils/JobToAiRequestMapper";
import { CommitJobInput, CommitJobOutput, completeJobType } from "./types/JobTypes";
import attemptRepository from "./attemptRepository";
import jobRepository from "./jobRepository";
import eventRepositoy from "./eventRepository"
import eventRepository from "./eventRepository";


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


async function completeJob({
	dbClient,
	jobId,
	attemptId,
	data,
	actualCost,
}: completeJobType): Promise<void> {
	
	const job = await jobRepository.getJob(dbClient, jobId);
	if (job.state !== "processing")
		throw new Error("Job is not in processing state");
	
	const attempt = await attemptRepository.getAttempt(dbClient, attemptId);
	if (attempt.state !== "validated")
		throw new Error("Attempt is not in validated state");
	if (typeof data === "undefined" || data === null) 
		throw new Error("Data is absent")
	
	
	await dbClient.query("BEGIN");
	try {
		const attemptResult = await attemptRepository.markCompleted(dbClient, attemptId, data)
		if (attemptResult.rowCount.length === 0) throw Error("Complete job operation failed at mark attempt completed")
			const jobResult = await jobRepository.markCompleted(dbClient, jobId, data, actualCost)
		if (jobResult.rowCount.length === 0) throw Error("Complete job operation failed at mark job completed")
		await eventRepository.createAttemptCompletedEvent(dbClient, attemptId)
		await eventRepository.createJobCompletedEvent(dbClient, jobId)
		await dbClient.query("COMMIT");
	} catch (error) {
		await dbClient.query("ROLLBACK");
		throw error;
	}
	return;
}

export default {
	createJob,
	planJob,
	completeJob
};
