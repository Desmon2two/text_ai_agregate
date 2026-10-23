import type { User } from "../../src/userFeature/types/userType.js";
import type { Job } from "../../src/jobFeature/types/JobTypes.js";
import type { Attempt } from "../../src/jobFeature/types/AttemptTypes.js";

function createTestUser(overrides: Partial<User> = {}): User {
  return {
    user_id: crypto.randomUUID(),
    email: "testEmail@example.com",
    password: "exampleUserPassword!!!!",
    credits: 100,
    ...overrides,
  };
}
function createTestJob(overrides: Partial<Job> = {}): Job {
  return {
    user_id: "c9593f4e-142f-4bff-9c45-5fabb90f45f9",
    job_id: crypto.randomUUID(),
    state: "CREATED",
    type: "QUESTION",
    estimated_cost: 100,
    ...overrides,
  };
}
function createTestAttempt(overrides: Partial<Attempt> = {}): Attempt {
  return {
    job_id: "344a3733-1f79-407b-a70c-b90781688b50",
    attempt_id: crypto.randomUUID(),
    attempt_number: 1,
    state: "CREATED",
    provider: "local",
    model: "gemma3b",
    ...overrides,
  };
}

export { createTestUser, createTestJob, createTestAttempt };
