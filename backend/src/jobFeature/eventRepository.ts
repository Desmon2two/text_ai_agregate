import { Client } from "pg";

async function createJobAcceptedEvent(dbClient: Client, jobId: string) {
  const result = await dbClient.query(
    `INSERT INTO events(name, job_id) 
    VALUES ('JOB_ACCEPTED', $1)
    RETURNING *
    `,
    [jobId],
  );
  if (result.rows.length === 0) {
    throw new Error("Event creation failed");
  }
  return result.rows[0];
}

async function createWorkerStartedEvent(dbClient: Client, jobId: string) {
  const result = await dbClient.query(
    `INSERT INTO events(name, job_id) 
    VALUES ('WORKER_STARTED', $1)
    RETURNING *
    `,
    [jobId],
  );
  if (result.rows.length === 0) {
    throw new Error("Event creation failed");
  }
  return result.rows[0];
}
async function createAttemptCreatedEvent(dbClient: Client, attemptId: string, metadata: {[...]}) {
  const result = await dbClient.query(
    `INSERT INTO events(name, attempt_id, metadata) 
    VALUES ('ATTEMPT_CREATED', $1, $2)
    RETURNING *
    `,
    [attemptId, metadata],
  );
  if (result.rows.length === 0) {
    throw new Error("Event creation failed");
  }
  return result.rows[0];
}
async function createSendingRequestEvent(dbClient: Client, attemptId: string) {
  const result = await dbClient.query(
    `INSERT INTO events(name, attempt_id) 
    VALUES ('SENDING_REQUEST', $1)
    RETURNING *
    `,
    [attemptId],
  );
  if (result.rows.length === 0) {
    throw new Error("Event creation failed");
  }
  return result.rows[0];
}
async function createWaitingForResponseEvent(
  dbClient: Client,
  attemptId: string,
  metadata: { providerJobId: string },
) {
  const result = await dbClient.query(
    `INSERT INTO events(name, attempt_id, metadata) 
    VALUES ('WAITING_FOR_RESPONSE', $1, $2)
    RETURNING *
    `,
    [attemptId, metadata],
  );
  if (result.rows.length === 0) {
    throw new Error("Event creation failed");
  }
  return result.rows[0];
}
async function createResponseReceivedEvent(dbClient: Client, attemptId: string) {
  const result = await dbClient.query(
    `INSERT INTO events(name, attempt_id) 
    VALUES ('RESPONSE_RECEIVED', $1)
    RETURNING *
    `,
    [attemptId],
  );
  if (result.rows.length === 0) {
    throw new Error("Event creation failed");
  }
  return result.rows[0];
}
async function createResponseValidatedEvent(
  dbClient: Client,
  attemptId: string,
) {
  const result = await dbClient.query(
    `INSERT INTO events(name, attempt_id) 
    VALUES ('RESPONSE_VALIDATED', $1)
    RETURNING *
    `,
    [attemptId],
  );
  if (result.rows.length === 0) {
    throw new Error("Event creation failed");
  }
  return result.rows[0];
}
async function createAttemptCompletedEvent(dbClient: Client, attemptId: string) {
  const result = await dbClient.query(
    `INSERT INTO events(name, attempt_id) 
    VALUES ('ATTEMPT_COMPLETED', $1)
    RETURNING *
    `,
    [attemptId],
  );
  if (result.rows.length === 0) {
    throw new Error("Event creation failed");
  }
  return result.rows[0];
}
async function createJobCompletedEvent(
  dbClient: Client,
  jobId: string,
) {
  const result = await dbClient.query(
    `INSERT INTO events(name, job_id) 
    VALUES ('JOB_COMPLETED', $1)
    RETURNING *
    `,
    [jobId],
  );
  if (result.rows.length === 0) {
    throw new Error("Event creation failed");
  }
  return result.rows[0];
}
async function createAttemptFailedEvent(
  dbClient: Client,
  attemptId: string,
  metadata: { error: unknown },
) {
  const result = await dbClient.query(
    `INSERT INTO events(name, attempt_id, metadata) 
    VALUES ('ATTEMPT_FAILED', $1, $2)
    RETURNING *
    `,
    [attemptId, metadata],
  );
  if (result.rows.length === 0) {
    throw new Error("Event creation failed");
  }
  return result.rows[0];
}
async function createJobFailedEvent(
  dbClient: Client,
  jobId: string,
  metadata: {error: unknown },
) {
  const result = await dbClient.query(
    `INSERT INTO events(name, job_id, metadata) 
    VALUES ('JOB_FAILED', $1, $2)
    RETURNING *
    `,
    [jobId, metadata],
  );
  if (result.rows.length === 0) {
    throw new Error("Event creation failed");
  }
  return result.rows[0];
}
async function createRecoveryStartedEvent(
  dbClient: Client,
  attemptId: string,
  jobId: string,
  metadata: { reason: string},
) {
  const result = await dbClient.query(
    `INSERT INTO events(name, attempt_id, job_id, metadata) 
    VALUES ('RECOVERY_STARTED', $1, $2, $3)
    RETURNING *
    `,
    [attemptId, jobId, metadata],
  );
  if (result.rows.length === 0) {
    throw new Error("Event creation failed");
  }
  return result.rows[0];
}
async function createRecoveryAbandonedEvent(
  dbClient: Client,
  attemptId: string,
  jobId: string,
  metadata: { reason: string},
) {
  const result = await dbClient.query(
    `INSERT INTO events(name, attempt_id, job_id, metadata) 
    VALUES ('RECOVERY_ABANDONED', $1, $2, $3)
    RETURNING *
    `,
    [attemptId, jobId, metadata],
  );
  if (result.rows.length === 0) {
    throw new Error("Event creation failed");
  }
  return result.rows[0];
}
async function createRecoveryCompletedEvent(
  dbClient: Client,
  attemptId: string,
  jobId: string,
  metadata: { reason: string},
) {
  const result = await dbClient.query(
    `INSERT INTO events(name, attempt_id, job_id, metadata) 
    VALUES ('RECOVERY_COMPLETED', $1, $2, $3)
    RETURNING *
    `,
    [attemptId, jobId, metadata],
  );
  if (result.rows.length === 0) {
    throw new Error("Event creation failed");
  }
  return result.rows[0];
}

export default {
  createJobAcceptedEvent,
  createWorkerStartedEvent,
  createAttemptCreatedEvent,
  createSendingRequestEvent,
  createWaitingForResponseEvent,
  createResponseReceivedEvent,
  createResponseValidatedEvent,
  createAttemptCompletedEvent,
  createJobCompletedEvent,
  createAttemptFailedEvent,
  createJobFailedEvent,
  createRecoveryStartedEvent,
  createRecoveryAbandonedEvent,
  createRecoveryCompletedEvent,
};
