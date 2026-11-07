import type { EventType } from "./types/EventType";
async function getEventById(dbClient: Client, event_id: string): Promise<EventType | null> {
  const link = await dbClient.prepare(
    `
  SELECT * FROM events
  WHERE event_id = ?
  ;`
);
link.run(1, event_id)
  link.close();
if (!link.rows[0]) return null;
  return link.rows[0];
}
async function createJobAcceptedEvent(dbClient: Client, job_id: string): Promise<EventType | null> {
  const link = await dbClient.prepare(
    `INSERT INTO events(name, job_id) 
    VALUES ('JOB_ACCEPTED', ?)
    RETURNING *
    ;`
  );
  link.run(1, job_id)
  link.close();
if (!link.rows[0]) return null;
  return link.rows[0];
}
async function createJobQueuedEvent(dbClient: Client, job_id: string): Promise<EventType | null> {
  const link = await dbClient.prepare(
    `INSERT INTO events(name, job_id) 
    VALUES ('JOB_QUEUED', ?)
    RETURNING *
    ;`
  );
  link.run(1, job_id)
  link.close();
if (!link.rows[0]) return null;
  return link.rows[0];
}
async function createJobProcessingEvent(dbClient: Client, job_id: string): Promise<EventType | null> {
  const link = await dbClient.prepare(
    `INSERT INTO events(name, job_id) 
    VALUES ('JOB_PROCESSING', ?)
    RETURNING *
    ;`
  );
  link.run(1, job_id)
  link.close();
if (!link.rows[0]) return null;
  return link.rows[0];
}
async function createJobProcessedFromIntermediateStateEvent(
  dbClient: Client,
  job_id: string,
): Promise<EventType | null> {
  const link = await dbClient.prepare(
    `INSERT INTO events(name, job_id) 
    VALUES ('JOB_PROCESSING_FROM_INTERMEDIATE_STATE', ?)
    RETURNING *
    ;`
  );
  link.run(1, job_id)
  link.close();
if (!link.rows[0]) return null;
  return link.rows[0];
}
async function createWorkerStartedEvent(dbClient: Client, job_id: string): Promise<EventType | null> {
  const link = await dbClient.prepare(
    `INSERT INTO events(name, job_id) 
    VALUES ('WORKER_STARTED', ?)
    RETURNING *
    ;`
  );
  link.run(1, job_id)
  link.close();
if (!link.rows[0]) return null;
  return link.rows[0];
}
async function createAttemptCreatedEvent(
  dbClient: Client,
  attempt_id: string,
  metadata: { origin: string },
): Promise<EventType | null> {
  const link = await dbClient.prepare(
    `INSERT INTO events(name, attempt_id, metadata) 
    VALUES ('ATTEMPT_CREATED', ?, ?)
    RETURNING *
    ;`
  );
  link.run(1, attempt_id)
  link.run(2, metadata)
  link.close();
if (!link.rows[0]) return null;
  return link.rows[0];
}
async function createSendingRequestEvent(dbClient: Client, attempt_id: string): Promise<EventType | null> {
  const link = await dbClient.prepare(
    `INSERT INTO events(name, attempt_id) 
    VALUES ('SENDING_REQUEST', ?)
    RETURNING *
    ;`
  );
  link.run(1, attempt_id)
  link.close();
if (!link.rows[0]) return null;
  return link.rows[0];
}
// async function createWaitingForResponseEvent(
//   dbClient: Client,
//   attempt_id: string,
//   metadata: { providerJobId: string },
// ): Promise<EventType | null> {
//   const link = await dbClient.prepare(
//     `INSERT INTO events(name, attempt_id, metadata) 
//     VALUES ('WAITING_FOR_RESPONSE', $1, $2)
//     RETURNING *
//     `,
// link.run(2, metadata),
//     link.run(1, attempt_id)
//   );
//   link.close();
// if (!link.rows[0]) return null;
//   return link.rows[0];
// }
async function createResponseReceivedEvent(
  dbClient: Client,
  attempt_id: string,
): Promise<EventType | null> {
  const link = await dbClient.prepare(
    `INSERT INTO events(name, attempt_id) 
    VALUES ('RESPONSE_RECEIVED', ?)
    RETURNING *
    ;`
  );
  link.run(1, attempt_id)
  link.close();
if (!link.rows[0]) return null;
  return link.rows[0];
}
async function createResponseValidatedEvent(
  dbClient: Client,
  attempt_id: string,
): Promise<EventType | null> {
  const link = await dbClient.prepare(
    `INSERT INTO events(name, attempt_id) 
    VALUES ('RESPONSE_VALIDATED', ?)
    RETURNING *
    ;`
  );
  link.run(1, attempt_id)
  link.close();
if (!link.rows[0]) return null;
  return link.rows[0];
}
async function createAttemptCompletedEvent(
  dbClient: Client,
  attempt_id: string,
): Promise<EventType | null> {
  const link = await dbClient.prepare(
    `INSERT INTO events(name, attempt_id) 
    VALUES ('ATTEMPT_COMPLETED', ?)
    RETURNING *
    ;`
  );
  link.run(1, attempt_id)
  link.close();
if (!link.rows[0]) return null;
  return link.rows[0];
}
async function createJobCompletedEvent(dbClient: Client, job_id: string): Promise<EventType | null> {
  const link = await dbClient.prepare(
    `INSERT INTO events(name, job_id) 
    VALUES ('JOB_COMPLETED', ?)
    RETURNING *
    ;`
  );
  link.run(1, job_id)
  link.close();
if (!link.rows[0]) return null;
  return link.rows[0];
}
async function createAttemptFailedEvent(
  dbClient: Client,
  attempt_id: string,
  metadata: { error: unknown },
): Promise<EventType | null> {
  const link = await dbClient.prepare(
    `INSERT INTO events(name, attempt_id, metadata) 
    VALUES ('ATTEMPT_FAILED', ?, ?)
    RETURNING *
    ;`
  );
  link.run(1, attempt_id)
  link.run(2, metadata)
  link.close();
if (!link.rows[0]) return null;
  return link.rows[0];
}
async function createJobFailedEvent(
  dbClient: Client,
  job_id: string,
  metadata: { error: unknown },
): Promise<EventType | null> {
  const link = await dbClient.prepare(
    `INSERT INTO events(name, job_id, metadata) 
    VALUES ('JOB_FAILED', ?, ?)
    RETURNING *
    ;`
  );
  link.run(1, job_id)
  link.run(2, metadata)
  link.close();
if (!link.rows[0]) return null;
  return link.rows[0];
}
async function createRetryCreatedEvent(
  dbClient: Client,
  job_id: string,
  attempt_id: string,
  metadata: { previousAttemptId: string },
): Promise<EventType | null> {
  const link = await dbClient.prepare(
    `INSERT INTO events(name, job_id, attempt_id, metadata) 
    VALUES ('RETRY_CREATED', ?, ?, ?)
    RETURNING *
    ;`
  );
    link.run(1, job_id)
  link.run(2, attempt_id)
  link.run(3, metadata)
  link.close();
if (!link.rows[0]) return null;
  return link.rows[0];
}
async function createRecoveryStartedEvent(
  dbClient: Client,
  job_id: string,
  metadata: { reason: string },
  attempt_id?: string,
): Promise<EventType | null> {
  const link = await dbClient.prepare(
    `INSERT INTO events(name, attempt_id, job_id, metadata) 
    VALUES ('RECOVERY_STARTED', ?, ?, ?)
    RETURNING *
    ;`
  );
  link.run(1, attempt_id || null)
  link.run(2, job_id)
  link.run(3, metadata)
  link.close();
if (!link.rows[0]) return null;
  return link.rows[0];
}
async function createRecoveryAbandonedEvent(
  dbClient: Client,
  job_id: string,
  metadata: { reason: string },
  attempt_id?: string,
): Promise<EventType | null> {
  const link = await dbClient.prepare(
    `INSERT INTO events(name, attempt_id, job_id, metadata) 
    VALUES ('RECOVERY_ABANDONED', ?, ?, ?)
    RETURNING *
    ;`
  );
  link.run(1, attempt_id || null)
  link.run(2, job_id)
  link.run(3, metadata)
  link.close();
if (!link.rows[0]) return null;
  return link.rows[0];
}
async function createCreditsAddedEvent(
  dbClient: Client,
  user_id: string,
  metadata: { reason: string; amount: number },
): Promise<EventType | null> {
  const link = await dbClient.prepare(
    `INSERT INTO events(name, user_id, metadata) 
    VALUES ('CREDITS_ADDED', ?, ?)
    RETURNING *
    ;`
  );
  link.run(1, user_id)
  link.run(2, metadata)
  link.close();
if (!link.rows[0]) return null;
  return link.rows[0];
}
async function createCreditsDeductedEvent(
  dbClient: Client,
  user_id: string,
  metadata: { reason: string; amount: number },
): Promise<EventType | null> {
  const link = await dbClient.prepare(
    `INSERT INTO events(name, user_id, metadata) 
    VALUES ('CREDITS_DEDUCTED', ?, ?)
    RETURNING *
    ;`
  );
    link.run(1, user_id)
  link.run(2, metadata)
  link.close();
if (!link.rows[0]) return null;
  return link.rows[0];
}
async function createRecoveryCompletedEvent(
  dbClient: Client,
  job_id: string,
  metadata: { reason: string },
  attempt_id?: string,
): Promise<EventType | null> {
  const link = await dbClient.prepare(
    `INSERT INTO events(name, attempt_id, job_id, metadata) 
    VALUES ('RECOVERY_COMPLETED', ?, ?, ?)
    RETURNING *
    ;`
  );
  link.run(1, attempt_id || null)
  link.run(2, job_id)
  link.run(3, metadata)
  link.close();
if (!link.rows[0]) return null;
  return link.rows[0];
}
async function deleteEvent(
  dbClient: Client,
  event_id: string,
): Promise<PostgreSQLResponse> {
  const link = await dbClient.prepare(
 $1   `DELETE FROM events WHERE event_id = ?;`
  );
  link.run(1, event_id)
  link.close()
  return link.rowCount;
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
