// a list of functions that create db tables, so they would be in one place.
// connect with an actual db calls to create IF NOT EXISTS and patch everything through
async function createRequiredTables(dbClient) {
    await dbClient.exec(`CREATE TABLE IF NOT EXISTS users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL, 
    password TEXT NOT NULL,
    username TEXT NOT NULL,
    credits INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
    ) STRICT;`);
    await dbClient.exec(`CREATE TABLE IF NOT EXISTS jobs (
	user_id INTEGER REFERENCES users,
    job_id INTEGER PRIMARY KEY AUTOINCREMENT, 
	state TEXT CHECK (
		state IN (
			'CREATED',
			'ACCEPTED',
			'QUEUED',
			'PROCESSING',
			'COMPLETED',
			'FAILED'
		)
	),
     type TEXT CHECK (
        type IN (
            'QUESTION',
            'SUMMARY',
            'CODE',
            'CLASSIFICATION',
            'LARGE_REPORT' 
        )
     ),
    body TEXT NOT NULL,
    files TEXT,
    error TEXT,
    data TEXT,
    metadata TEXT,
    recovery_lease_until TEXT,
    estimated_cost INTEGER NOT NULL,
    actual_cost INTEGER,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    completed_at TEXT
) STRICT;`);
    await dbClient.exec(`CREATE TABLE IF NOT EXISTS attempts ( 
    attempt_id INTEGER PRIMARY KEY AUTOINCREMENT,
    job_id INTEGER REFERENCES jobs,
    attempt_number INTEGER NOT NULL DEFAULT 1,
    state TEXT CHECK (
        state IN (
            'CREATED',
            'SENDING',
            'WAITING',
            'RECEIVED',
            'VALIDATED',
            'COMPLETED',
            'FAILED')
    ),
    provider TEXT NOT NULL,
    model TEXT NOT NULL,
    data TEXT,
    error TEXT,
    retryable INTEGER DEFAULT 0,
    provider_operation_id TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    started_at TEXT,
    updated_at TEXT DEFAULT (datetime('now')),
    completed_at TEXT,
    last_heartbeat_at TEXT,
    recovery_lease_until TEXT
) STRICT;`);
    await dbClient.exec(`CREATE TABLE IF NOT EXISTS events (
  event_id INTEGER PRIMARY KEY AUTOINCREMENT, 
  attempt_id INTEGER REFERENCES attempts,
  job_id INTEGER REFERENCES jobs,
  name TEXT NOT NULL,
  metadata TEXT,
  created_at TEXT DEFAULT (datetime('now'))
) STRICT;`);
    await dbClient.exec(`CREATE TABLE IF NOT EXISTS fin_logs (
  user_id INTEGER REFERENCES users,
  fin_log_id INTEGER PRIMARY KEY AUTOINCREMENT,
  amount INTEGER NOT NULL,
  reason TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
) STRICT;`);
    await dbClient.exec(`CREATE TABLE IF NOT EXISTS models (
provider TEXT NOT NULL,
model TEXT NOT NULL,
input_price_for_1m_tokens INTEGER NOT NULL,
output_price_for_1m_tokens INTEGER NOT NULL
) STRICT;`);
}
export default {
    createRequiredTables,
};
