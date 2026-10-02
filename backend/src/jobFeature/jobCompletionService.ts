import { completeJobType } from "./types/JobTypes";
import { dbClient } from "../database/dbClient";

async function completeJob({
	jobId,
	attemptId,
	data,
}: completeJobType): Promise<void> {
	await dbClient.query("BEGIN");
	try {
		const job = await jobRepository.getJob(dbClient, jobId);
		if (job.state !== "processing")
			throw new Error("Job is not in processing state");
		const attempt = await attemptRepository.getAttempt(dbClient, attemptId);
		if (attempt.state !== "validated")
			throw new Error("Attempt is not in validated state");

		await markAttemptAndJobSucceded(dbClient, jobId, attemptId);
		await attemptRepository.markComplete(dbClient, attemptId, data)
		await jobRepository.markComplete(dbClient, jobId, data)
		await dbClient.query("COMMIT");
	} catch (error) {
		await dbClient.query("ROLLBACK");
		throw error;
	}
	return;
}
export default {
	completeJob,
};
