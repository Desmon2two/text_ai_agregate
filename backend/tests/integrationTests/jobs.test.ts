import jobRepository from "../../src/jobFeature/jobRepository.js";

import { setupTestDB, teardownTestDB } from "../helpers/testDatabase.js";
let dbClient: Awaited<ReturnType<typeof setupTestDB>>;
beforeAll(async () => {
  dbClient = await setupTestDB();
});
afterAll(async () => {
  try {
    await jobRepository.deleteJob(dbClient, jobId);
    console.log("Test job was deleted");
  } finally {
    await teardownTestDB(dbClient);
  }
});

let jobId: string;

describe("Testing users, job, attempt, and events creation and deletion", () => {
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
});
