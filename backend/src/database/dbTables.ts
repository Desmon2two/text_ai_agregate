// a list of functions that create db tables, so they would be in one place.
// connect with an actual db calls to create IF NOT EXISTS and patch everything through

async function createRequiredTables(dbClient){
await dbClient.exec(`CREATE TABLE IF NOT EXISTS fin_logs (
  user_id INTEGER REFERENCES users,
  fin_log_id INTEGER PRIMARY KEY AUTOINCREMENT,
  amount INTEGER NOT NULL,
  reason TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT date())
)`);


await dbClient.exec(`CREATE TABLE IF NOT EXISTS users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    mail TEXT NOT NULL, 
    password TEXT NOT NULL,
    username TEXT NOT NULL,
    credits INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT date()))`);

await dbClient.exec(`CREATE TABLE IF NOT EXISTS jobs (
    job_id INTEGER PRIMARY KEY AUTOINCREMENT, 
     type job_types,
    body JSONB NOT NULL,
    files JSON,
    error TEXT,
    data JSONB,
    metadata JSONB,
    recovery_lease_until TEXT,
    estimated_cost INTEGER NOT NULL,
    actual_cost INTEGER ,
    created_at TEXT ),
    updated_at TEXT ),
    completed_at TEXT
)`);

await dbClient.exec(`CREATE TABLE IF NOT EXISTS events (
  event_id INTEGER PRIMARY KEY AUTOINCREMENT, 
  attempt_id INTEGER REFERENCES attempts,
  job_id INTEGER REFERENCES jobs,
  user_id INTEGER REFERENCES users,
  name TEXT NOT NULL,
  metadata JSONB,
  created_at TEXT NOT NULL DEFAULT date())
)`);


await dbClient.exec(`CREATE TABLE IF NOT EXISTS models (
provider TEXT NOT NULL,
model TEXT NOT NULL,
input_price_for_1m_tokens INTEGER NOT NULL,
output_price_for_1m_tokens INTEGER NOT NULL
)`);


await dbClient.exec(`CREATE TYPE IF NOT EXISTS attempt_states AS ENUM ('CREATED', 'SENDING', 'WAITING', 'RECEIVED', 'VALIDATED', 'COMPLETED', 'FAILED')`); dbClient.exec(`CREATE TABLE IF NOT EXISTS attempts ( attempt_id INTEGER PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id INTEGER REFERENCES jobs,
    attempt_number INTEGER NOT NULL DEFAULT 1,
    state attempt_states,
    provider TEXT NOT NULL,
    model TEXT NOT NULL,
    data JSONB DEFAULT NULL,
    error JSONB DEFAULT NULL,
    retryable INTEGER DEFAULT 0,
    provider_operation_id INTEGER,
    created_at TEXT NOT NULL DEFAULT date(),
    started_at TEXT,
    updated_at TEXT NOT NULL ,
    completed_at TEXT,
    last_heartbeat_at TEXT,
    recovery_lease_until TEXT
)`);
}
export default{
    createRequiredTables,
}