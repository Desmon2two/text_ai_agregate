import type { EventType } from "./types/EventType";
async function getEventById(dbClient: Client, event_id: string): Promise<EventType | null> {
	const link = await dbClient.prepare(
		`SELECT * FROM events
  WHERE event_id = ?`
	).get(event_id);
	if (!link) return null;
	return link;
}
async function createJobAcceptedEvent(dbClient: Client, job_id: string): Promise<EventType | null> {
	const link = await dbClient.prepare(
		`INSERT INTO events(name, job_id) 
    VALUES ('JOB_ACCEPTED', ?)
    RETURNING *`
	).get(job_id);
	if (!link) return null;
	return link;
}
async function createJobQueuedEvent(dbClient: Client, job_id: string): Promise<EventType | null> {
	const link = await dbClient.prepare(
		`INSERT INTO events(name, job_id) 
    VALUES ('JOB_QUEUED', ?)
    RETURNING *`
	).get(job_id);
	if (!link) return null;
	return link;
}
async function createJobProcessingEvent(dbClient: Client, job_id: string): Promise<EventType | null> {
	const link = await dbClient.prepare(
		`INSERT INTO events(name, job_id) 
    VALUES ('JOB_PROCESSING', ?)
    RETURNING *`
	).get(job_id);
	if (!link) return null;
	return link;
}
async function createJobProcessedFromIntermediateStateEvent(
	dbClient: Client,
	job_id: string,
): Promise<EventType | null> {
	const link = await dbClient.prepare(
		`INSERT INTO events(name, job_id) 
    VALUES ('JOB_PROCESSING_FROM_INTERMEDIATE_STATE', ?)
    RETURNING *`
	).get(job_id);
	if (!link) return null;
	return link;
}
async function createWorkerStartedEvent(dbClient: Client, job_id: string): Promise<EventType | null> {
	const link = await dbClient.prepare(
		`INSERT INTO events(name, job_id) 
    VALUES ('WORKER_STARTED', ?)
    RETURNING *`
	).get(job_id);
	if (!link) return null;
	return link;
}
async function createAttemptCreatedEvent(
	dbClient: Client,
	attempt_id: string,
	metadata: { origin: string },
): Promise<EventType | null> {
	const link = await dbClient.prepare(
		`INSERT INTO events(name, attempt_id, JSON.stringify(metadata)) 
    VALUES ('ATTEMPT_CREATED', ?, ?)
    RETURNING *`
	).get(attempt_id, JSON.stringify(metadata));
	if (!link) return null;
	return link;
}
async function createSendingRequestEvent(dbClient: Client, attempt_id: string): Promise<EventType | null> {
	const link = await dbClient.prepare(
		`INSERT INTO events(name, attempt_id) 
    VALUES ('SENDING_REQUEST', ?)
    RETURNING *`
	).get(attempt_id);
	if (!link) return null;
	return link;
}
// async function createWaitingForResponseEvent(
//   dbClient: Client,
//   attempt_id: string,
//   metadata: { providerJobId: string },
// ): Promise<EventType | null> {
//   const link = await dbClient.prepare(
//     `INSERT INTO events(name, attempt_id, JSON.stringify(metadata)) 
//     VALUES ('WAITING_FOR_RESPONSE', $1, $2)
//     RETURNING *
//     `,
// link.run(2, JSON.stringify(metadata)),
//     link.run(1, attempt_id)
//   );
//   link.close();
// if (!link) return null;
//   return link;
// }
async function createResponseReceivedEvent(
	dbClient: Client,
	attempt_id: string,
): Promise<EventType | null> {
	const link = await dbClient.prepare(
		`INSERT INTO events(name, attempt_id) 
    VALUES ('RESPONSE_RECEIVED', ?)
    RETURNING *`).get(attempt_id);
	if (!link) return null;
	return link;
}
async function createResponseValidatedEvent(
	dbClient: Client,
	attempt_id: string,
): Promise<EventType | null> {
	const link = await dbClient.prepare(
		`INSERT INTO events(name, attempt_id) 
    VALUES ('RESPONSE_VALIDATED', ?)
    RETURNING *`).get(attempt_id);
	if (!link) return null;
	return link;
}
async function createAttemptCompletedEvent(
	dbClient: Client,
	attempt_id: string,
): Promise<EventType | null> {
	const link = await dbClient.prepare(
		`INSERT INTO events(name, attempt_id) 
    VALUES ('ATTEMPT_COMPLETED', ?)
    RETURNING *`).get(attempt_id);
	if (!link) return null;
	return link;
}
async function createJobCompletedEvent(dbClient: Client, job_id: string): Promise<EventType | null> {
	const link = await dbClient.prepare(
		`INSERT INTO events(name, job_id) 
    VALUES ('JOB_COMPLETED', ?1)
    RETURNING *`).get(job_id);
	if (!link) return null;
	return link;
}
async function createAttemptFailedEvent(
	dbClient: Client,
	attempt_id: string,
	metadata: { error: unknown },
): Promise<EventType | null> {
	const link = await dbClient.prepare(
		`INSERT INTO events(name, attempt_id, JSON.stringify(metadata)) 
    VALUES ('ATTEMPT_FAILED', ?, ?)
    RETURNING *`).get(attempt_id, JSON.stringify(metadata));
	if (!link) return null;
	return link;
}
async function createJobFailedEvent(
	dbClient: Client,
	job_id: string,
	metadata: { error: unknown },
): Promise<EventType | null> {
	const link = await dbClient.prepare(
		`INSERT INTO events(name, job_id, JSON.stringify(metadata)) 
    VALUES ('JOB_FAILED', ?1, ?2)
    RETURNING *`).get(job_id, JSON.stringify(metadata));
	if (!link) return null;
	return link;
}
async function createRetryCreatedEvent(
	dbClient: Client,
	job_id: string,
	attempt_id: string,
	metadata: { previousAttemptId: string },
): Promise<EventType | null> {
	const link = await dbClient.prepare(
		`INSERT INTO events(name, job_id, attempt_id, JSON.stringify(metadata)) 
    VALUES ('RETRY_CREATED', ?1, ?2, ?3)
    RETURNING *`).get(job_id, attempt_id, JSON.stringify(metadata));
	if (!link) return null;
	return link;
}
async function createRecoveryStartedEvent(
	dbClient: Client,
	job_id: string,
	metadata: { reason: string },
	attempt_id?: string,
): Promise<EventType | null> {
	const link = await dbClient.prepare(
		`INSERT INTO events(name, attempt_id, job_id, JSON.stringify(metadata)) 
    VALUES ('RECOVERY_STARTED', ?, ?, ?)
    RETURNING *`).get(attempt_id, job_id, JSON.stringify(metadata));
	if (!link) return null;
	return link;
}
async function createRecoveryAbandonedEvent(
	dbClient: Client,
	job_id: string,
	metadata: { reason: string },
	attempt_id?: string,
): Promise<EventType | null> {
	const link = await dbClient.prepare(
		`INSERT INTO events(name, attempt_id, job_id, JSON.stringify(metadata)) 
    VALUES ('RECOVERY_ABANDONED', ?1, ?2, ?3)
    RETURNING *`).get(attempt_id, job_id, JSON.stringify(metadata));
	if (!link) return null;
	return link;
}
async function createCreditsAddedEvent(
	dbClient: Client,
	user_id: string,
	metadata: { reason: string; amount: number },
): Promise<EventType | null> {
	const link = await dbClient.prepare(
		`INSERT INTO events(name, user_id, JSON.stringify(metadata)) 
    VALUES ('CREDITS_ADDED', ?1, ?2)
    RETURNING *`).get(user_id, JSON.stringify(metadata));
	if (!link) return null;
	return link;
}
async function createCreditsDeductedEvent(
	dbClient: Client,
	user_id: string,
	metadata: { reason: string; amount: number },
): Promise<EventType | null> {
	const link = await dbClient.prepare(
		`INSERT INTO events(name, user_id, JSON.stringify(metadata)) 
    VALUES ('CREDITS_DEDUCTED', ?, ?)
    RETURNING *`).get(user_id, JSON.stringify(metadata));
	if (!link) return null;
	return link;
}
async function createRecoveryCompletedEvent(
	dbClient: Client,
	job_id: string,
	metadata: { reason: string },
	attempt_id?: string,
): Promise<EventType | null> {
	const link = await dbClient.prepare(
		`INSERT INTO events(name, attempt_id, job_id, JSON.stringify(metadata)) 
    VALUES ('RECOVERY_COMPLETED', ?1, ?2, ?3)
    RETURNING *`).get(attempt_id, job_id, JSON.stringify(metadata));
	if (!link) return null;
	return link;
}
async function deleteEvent(
	dbClient: Client,
	event_id: string,
): Promise<0 | 1> {
	const link = await dbClient.prepare(
		`DELETE FROM events WHERE event_id = ?;`
	).get(event_id);
	if (!link) return 1
	return 0;
}

export default {
	getEventById,
	createJobAcceptedEvent,
	createJobQueuedEvent,
	createJobProcessingEvent,
	createJobProcessedFromIntermediateStateEvent,
	createWorkerStartedEvent,
	createAttemptCreatedEvent,
	createSendingRequestEvent,
	// createWaitingForResponseEvent,
	createResponseReceivedEvent,
	createResponseValidatedEvent,
	createAttemptCompletedEvent,
	createJobCompletedEvent,
	createAttemptFailedEvent,
	createJobFailedEvent,
	createRetryCreatedEvent,
	createRecoveryStartedEvent,
	createRecoveryAbandonedEvent,
	createRecoveryCompletedEvent,
	deleteEvent,
	createCreditsAddedEvent,
	createCreditsDeductedEvent,
};
