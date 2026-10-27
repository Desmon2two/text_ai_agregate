import { setupTestDB, teardownTestDB } from "../helpers/testDatabase.js";
import queueService from "../../src/queue/queueService.js";
import { worker } from "../../src/queue/worker.js";
import { QueueEvents } from "bullmq";
import {
  createTestAttempt,
  createTestJob,
} from "../helpers/factoryFunctions.js";
import attemptRepository from "../../src/jobFeature/attemptRepository.js";
import { once } from "node:events";
import jobRepository from "../../src/jobFeature/jobRepository.js";
import jobService from "../../src/jobFeature/jobService.js";
let dbClient: Awaited<ReturnType<typeof setupTestDB>>;
beforeAll(async () => {
  dbClient = await setupTestDB();
});
afterAll(async () => {
  await teardownTestDB(dbClient);
  await queueService.dispatchQueue.obliterate({ force: true });
  await queueService.recoveryQueue.obliterate({ force: true });
  await worker.close();
  await queueEvents.close();
  await queueService.disconnectQueue(queueService.dispatchQueue);
  await queueService.disconnectQueue(queueService.recoveryQueue);
});
const queueEvents = new QueueEvents("dispatchQueue");

describe("Testing dispatch workers", () => {
  it("Should accept fresh jobs/attempts and start processing them", async () => {
    const { user_id, type, body, estimated_cost } = createTestJob({
      job_id: null,
    });
    const newTestJob = await jobService.createJob(
      dbClient,
      user_id,
      type,
      body,
      estimated_cost,
    );
    await jobService.markAccepted(dbClient, newTestJob?.job_id);
    const { attempt_number, provider, model } = createTestAttempt({
      attempt_id: null,
    });
    const newTestAttempt = await attemptRepository.createAttempt(
      dbClient,
      newTestJob?.job_id,
      attempt_number,
      provider,
      model,
    );

    const completedPromise = once(queueEvents, "completed");
    await queueService.addJobToDispatchQueue(dbClient, {
      job_id: newTestJob.job_id,
      attempt_id: newTestAttempt.attempt_id,
    });
    const [event] = await completedPromise;
    console.log("Job completed :", event);
    const atmpt = await attemptRepository.getAttemptById(
      dbClient,
      newTestAttempt.attempt_id,
    );
    const jb = await jobRepository.getJobById(dbClient, newTestJob.job_id)
    expect(atmpt.state).toBe("COMPLETED");
    expect(jb.state).toBe("COMPLETED");
  });
  it("Should detect invalid inputs and gracefully handle them", async () => {});
  it("Should detect invalid users/jobs/attempts", async () => {});
  it("Should detect event emissions and react to them", async () => {});
  it("Should process entire job, with waiting for response in idle", async () => {});
  it("Should store providerOperationId in database", async () => {});
  it("Should return completed job's data to user", async () => {});
});
