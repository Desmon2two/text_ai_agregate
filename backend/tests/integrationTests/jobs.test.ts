import jobRepository from "../../src/jobFeature/jobRepository.js";
import { createTestJob } from "../helpers/factoryFunctions.js";

import { setupTestDB, teardownTestDB } from "../helpers/testDatabase.js";
let dbClient: Awaited<ReturnType<typeof setupTestDB>>;
beforeAll(async () => {
  dbClient = await setupTestDB();
});
afterAll(async () => {
  await teardownTestDB(dbClient);
});
beforeEach(async () => {
  await dbClient.query("BEGIN");
});
afterEach(async () => {
  await dbClient.query("ROLLBACK");
});

describe("Testing jobs repository", () => {
  it(" Should create jobs", async () => {
    const {user_id, type, body, estimated_cost} = createTestJob()
    const result = await jobRepository.createJob(dbClient, user_id, type, body, estimated_cost);
    expect(result?.estimated_cost).toBe(estimated_cost);
  });
  it("should delete jobs", async () => {
    const {job_id} = createTestJob()
    const res = await jobRepository.deleteJob(dbClient, job_id);
    expect(res.rowCount).toBe(1);
  });
  it("Should not allow transition to complete without data", async () => {
    const job = createTestJob({state: 'PROCESSING'})
    expect(
      await jobRepository.markCompleted(dbClient, job.job_id, null, null)
    ).rejects.toThrow()
  });
  it("Should not allow invalid state transitions", async () => {
    const job = createTestJob({state: "COMPLETED"})
    const testJob = await jobRepository.createJob(dbClient, job.user_id, job.type, job.body, job.estimated_cost)
    expect(
      await jobRepository.markCompleted(dbClient, testJob.job_id, job.data, job.actual_cost)
    ).rejects.toThrow()
  });
});
