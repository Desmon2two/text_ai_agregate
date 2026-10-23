import jobRepository from "../../src/jobFeature/jobRepository.js";

import { setupTestDB, teardownTestDB } from "../helpers/testDatabase.js";
let dbClient: Awaited<ReturnType<typeof setupTestDB>>;
beforeAll(async () => {
  dbClient = await setupTestDB();
}, 15000);
afterAll(async () => {
  await teardownTestDB(dbClient);
}, 15000);

let jobId: string;

describe("Testing jobs repository", () => {
  it(" Should create jobs", async () => {
    const job = {
      dbClient,
      type: "SUMMARY",
      body: { origin: "testing" },
      userId: "c9593f4e-142f-4bff-9c45-5fabb90f45f9",
      estimatedCost: 1,
    };
    const result = await jobRepository.createJob(job);
    jobId = result.job_id;
    expect(result).not.toBeNull();
  });
  it("should support external atomic wrapper", async () => {
    const job = {
      dbClient,
      type: "SUMMARY",
      body: { origin: "testing" },
      userId: "c9593f4e-142f-4bff-9c45-5fabb90f45f9",
      estimatedCost: 1,
    };
    await dbClient.query("BEGIN");
    const resJob = await jobRepository.createJob(job);
    await dbClient.query("ROLLBACK");
    const result = await jobRepository.getJobById(dbClient, resJob.job_id);
    expect(result).toBeNull();
  });
  it("should delete jobs", async () => {
    const res = await jobRepository.deleteJob(dbClient, jobId);
    expect(res.rowCount).toBe(1);
  });
  it("Should not allow invalid state transitions", async () => {});
});
