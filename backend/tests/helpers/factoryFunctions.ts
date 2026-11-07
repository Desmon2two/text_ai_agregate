import type { User } from "../../src/userFeature/types/userType.js";
import type { Job } from "../../src/jobFeature/types/JobTypes.js";
import type { Attempt } from "../../src/jobFeature/types/AttemptTypes.js";

function createTestUser(overrides: Partial<User> = {}): User {
  return {
    user_id: crypto.randomUUID(),
    username: "testUser",
    email: "tstEmail@example.com",
    password: "exampleUserPassword!!!!",
    credits: 100,
    ...overrides,
  };
}
function createTestJob(overrides: Partial<Job> = {}): Job {
  return {
    user_id: "1",
    job_id: crypto.randomUUID(),
    state: "CREATED",
    type: "QUESTION",
    estimated_cost: 100,
    body: {
      prompt: "Hello!!!",
    },
    ...overrides,
  };
}
function createTestAttempt(overrides: Partial<Attempt> = {}): Attempt {
  return {
    job_id: "1",
    attempt_id: crypto.randomUUID(),
    attempt_number: 1,
    state: "CREATED",
    provider: "local",
    model: "gemma3:1b",
    ...overrides,
  };
}

export { createTestUser, createTestJob, createTestAttempt };
