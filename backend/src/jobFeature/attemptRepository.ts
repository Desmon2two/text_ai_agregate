import { AttemptError } from "../errors/AttemptErrorType";
import { CreateAttemptInput } from "./types/AttemptTypes";
import { Client } from "pg";
async function getAttempt(dbClient: Client, attemptId: string) {
	const result = await dbClient.query(
		`SELECT * FROM attempts
      WHERE attempt_id = $1
      `,
		[attemptId],
	);
	return result.rows[0];
}
async function createAttempt({
	dbClient,
	jobId,
	attemptNumber,
	provider,
	model,
}: CreateAttemptInput) {
	const result = await dbClient.query(
		`INSERT INTO attempts(state, job_id, attempt_number, provider, model) 
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
    `,
		["CREATED", jobId, attemptNumber, provider, model],
	);
	if (result.rows.length === 0) {
		throw new Error("Attempt transition failed");
	}
	return result.rows[0];
}
async function markSending(dbClient: Client, attemptId: string) {
	const result = await dbClient.query(
		`UPDATE attempts
    SET state = $3, updated_at = NOW()
    WHERE attempt_id = $1
    AND state = $2
    RETURNING *
    `,
		[attemptId, "CREATED", "SENDING"],
	);
	if (result.rows.length === 0) {
		throw new Error("Attempt transition failed");
	}
	return result.rows[0];
}
async function markWaiting(
	dbClient: Client,
	attemptId: string,
	providerJobId?: string,
) {
	const result = await dbClient.query(
		`UPDATE attempts
    SET state = $3, provider_job_id = $4, updated_at = NOW()
    WHERE attempt_id = $1
    AND state = $2
    RETURNING *
    `,
		[attemptId, "SENDING", "WAITING", providerJobId || null],
	);
	if (result.rows.length === 0) {
		throw new Error("Attempt transition failed");
	}
	return result.rows[0];
}
async function markReceived(
	dbClient: Client,
	attemptId: string,
	data: unknown,
) {
	const result = await dbClient.query(
		`UPDATE attempts
    SET state = $3, data = $4, updated_at = NOW()
    WHERE attempt_id = $1
    AND state = $2
    RETURNING *
    `,
		[attemptId, "WAITING", "RECEIVED", data],
	);
	if (result.rows.length === 0) {
		throw new Error("Attempt transition failed");
	}
	return result.rows[0];
}
async function markValidated(
	dbClient: Client,
	attemptId: string,
	data: unknown,
) {
	const result = await dbClient.query(
		`UPDATE attempts
    SET state = $3, data = $4, updated_at = NOW()
    WHERE attempt_id = $1
    AND state = $2
    RETURNING *
    `,
		[attemptId, "RECEIVED", "VALIDATED", data],
	);
	if (result.rows.length === 0) {
		throw new Error("Attempt transition failed");
	}
	return result.rows[0];
}
async function markComplete(
	dbClient: Client,
	attemptId: string,
	data: unknown,
) {
	const result = await dbClient.query(
		`UPDATE attempts
    SET state = $3, data = $4, updated_at = NOW(), completed_at = NOW()
    WHERE attempt_id = $1
    AND state = $2
    RETURNING *
    `,
		[attemptId, "VALIDATED", "COMPLETE", data],
	);
	if (result.rows.length === 0) {
		throw new Error("Attempt transition failed");
	}
	return result.rows[0];
}
async function markFailed(
	dbClient: Client,
	attemptId: string,
	error: AttemptError,
) {
	const result = await dbClient.query(
		`UPDATE attempts
    SET state = $2, error = $3, updated_at = NOW()
    WHERE attempt_id = $1
    AND state IN ('CREATED', 'SENDING', 'WAITING', 'RECEIVED', 'VALIDATED')
    RETURNING *
    `,
		[attemptId, "FAILED", error],
	);
	if (result.rows.length === 0) {
		throw new Error("Attempt transition failed");
	}
	return result.rows[0];
}
export default {
	getAttempt,
	createAttempt,
	markSending,
	markWaiting,
	markReceived,
	markValidated,
	markComplete,
	markFailed,
};
