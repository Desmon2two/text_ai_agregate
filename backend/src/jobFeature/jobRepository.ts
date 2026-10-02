import { Client } from "pg";
import { CreateJob } from "./types/JobTypes";
async function getJob(dbClient: Client, jobId: string) {
	const result = await dbClient.query(
		`
        SELECT * FROM jobs 
        WHERE job_id = $1
        `,
		[jobId],
	);
	return result.rows[0];
}
async function createJob({
	dbClient,
	jobType,
	body,
	userId,
	estimatedCost,
}: CreateJob) {
	const result = await dbClient.query(
		`INSERT INTO jobs (state, type, body, user_id, estimated_cost)
        VALUES ($1, $2, $3, $4, $5)
    RETURNING *
    `,
		["CREATED", jobType, body, userId, estimatedCost],
	);
	if (result.rows.length === 0) {
		throw new Error("Attempt transition failed");
	}
	return result.rows[0];
}
async function markAccepted(dbClient: Client, jobId: string) {
	const result = await dbClient.query(
		`UPDATE jobs
    SET state = $3, updated_at = NOW()
    WHERE job_id = $1
    AND state = $2
    RETURNING *
    `,
		[jobId, "CREATED", "SENDING"],
	);
	if (result.rows.length === 0) {
		throw new Error("Attempt transition failed");
	}
	return result.rows[0];
}
async function markQueued(dbClient: Client, jobId: string) {
	const result = await dbClient.query(
		`UPDATE jobs
    SET state = $3, updated_at = NOW()
    WHERE job_id = $1
    AND state = $2
    RETURNING *
    `,
		[jobId, "CREATED", "SENDING"],
	);
	if (result.rows.length === 0) {
		throw new Error("Attempt transition failed");
	}
	return result.rows[0];
}
async function markProcessing(dbClient: Client, jobId: string) {
	const result = await dbClient.query(
		`UPDATE jobs
    SET state = $3, updated_at = NOW()
    WHERE job_id = $1
    AND state = $2
    RETURNING *
    `,
		[jobId, "CREATED", "SENDING"],
	);
	if (result.rows.length === 0) {
		throw new Error("Attempt transition failed");
	}
	return result.rows[0];
}
async function markComplete(dbClient: Client, jobId: string, data: unknown) {
	const result = await dbClient.query(
		`UPDATE jobs
    SET state = $3, data = $4, updated_at = NOW(), completed_at = NOW()
    WHERE job_id = $1
    AND state = $2
    RETURNING *
    `,
		[jobId, "CREATED", "SENDING"],
	);
	if (result.rows.length === 0) {
		throw new Error("Attempt transition failed");
	}
	return result.rows[0];
}
async function markFailed(dbClient: Client, jobId: string, error: unknown) {
	const result = await dbClient.query(
		`UPDATE jobs
    SET state = $3, updated_at = NOW()
    WHERE job_id = $1
    AND state = $2
    RETURNING *
    `,
		[jobId, "CREATED", "SENDING"],
	);
	if (result.rows.length === 0) {
		throw new Error("Attempt transition failed");
	}
	return result.rows[0];
}
export default {
	getJob,
	createJob,
	markAccepted,
	markQueued,
	markProcessing,
	markComplete,
	markFailed,
};
