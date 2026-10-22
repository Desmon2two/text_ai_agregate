import mapJobToAiRequest from "../infrastructure/utils/JobToAiRequestMapper.js";
import type { CommitJobOutput } from "./types/JobTypes.js";
import attemptRepository from "./attemptRepository.js";
import jobRepository from "./jobRepository.js";
import eventRepository from "./eventRepository.js";
import { Client } from "pg";


async function createJob(dbClient: Client, type: string, estimatedCost: number, userId: string, {provider, model}, body: {prompt: string, [keys?: any]}, filesUrl?: string): Promise<CommitJobOutput> {
	try {
		await dbClient.query("BEGIN")
		const job = await jobRepository.createJob({
			dbClient,
			type,
			body,
			userId,
			estimatedCost,
		});
		if (job === null) throw new Error("Error during job creation");
		const attempt = await attemptRepository.createAttempt({dbClient, jobId: job.jobId, attemptNumber: 1, provider, model})
		if (attempt === null) throw new Error("Error during attempt creation");
		await eventRepository.createAttemptCreatedEvent(dbClient, attempt.attemptId, {origin: "Initial basic creation"})
		await eventRepository.createJobAcceptedEvent(dbClient, job.jobId);
		await dbClient.query("COMMIT")
		await queueService.enqueue(job.jobId)
		
		return {
			jobId: job.jobId,
			createdAt: job.createdAt,
		};
	
} catch (error) {
	await dbClient.query("ROLLBACK")
	throw new Error(error.message)
}}




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

async function commitJob(userId: string, jobType, provider, model, body, files): CommitJobOutput {
	const isAllowed = userService.checkUser();
	if (!isAllowed) throw new UnauthorizedError("User is not allowed");
	const aiRequest = mapJobToAiRequest({jobType, provider, model, body, files});
}


async function completeJob(
	dbClient: Client,
	jobId: string,
	attemptId: string,
): Promise<void> {
	
	const job = await jobRepository.getJob(dbClient, jobId);
	if (job === null) throw new Error("No such job for completeJob")
	if (job.state !== "PROCESSING")
		throw new Error("Job is not in processing state");
	
	const attempt = await attemptRepository.getAttempt(dbClient, attemptId);
	if (attempt === null) throw new Error("No such attempt for completeJob")
	if (attempt.state !== "VALIDATED")
		throw new Error("Attempt is not in validated state");
	if (typeof attempt.data === "undefined" || attempt.data === null) 
		throw new Error("Data is absent")
	
	
	await dbClient.query("BEGIN");
	try {
		const attemptResult = await attemptRepository.markCompleted(dbClient, attemptId, attempt.data)
		if (attemptResult.rowCount.length === 0) throw Error("Complete job operation failed at mark attempt completed")
			const actualCost = await finService.calculateActualCost(attemptId)
			const jobResult = await jobRepository.markCompleted(dbClient, jobId, attempt.data, actualCost)
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
