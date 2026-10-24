import { setupTestDB, teardownTestDB } from "../helpers/testDatabase.js";
import queueService from "../../src/queue/queueService.js";
import { worker } from "../../src/queue/worker.js";
import { QueueEvents } from "bullmq";
let dbClient: Awaited<ReturnType<typeof setupTestDB>>;
beforeAll(async () => {
  dbClient = await setupTestDB();
});
afterAll(async () => {
  await teardownTestDB(dbClient);
  await queueService.dispatchQueue.obliterate({ force: true });
  await queueService.recoveryQueue.obliterate({ force: true });
  await worker.close()
  await queueEvents.close();
  await queueService.disconnectQueue(queueService.dispatchQueue);
  await queueService.disconnectQueue(queueService.recoveryQueue);
});
const queueEvents = new QueueEvents("dispatchQueue")

describe("Testing dispatch workers", () => {
  it("Should basically work", async () => {
    const job = await queueService.addJobToDispatchQueue()
    queueEvents.on("completed", ({jobId, returnvalue}) =>{
      console.log(jobId, returnvalue)
      expect(job.returnvalue).toBe(returnvalue);
    })
  });
  it("Should accept fresh jobs and start processing them", async () => {});
  it("Should accept fresh attempts and start processing them", async () => {});
  it("Should detect invalid inputs and gracefully handle them", async () => {});
  it("Should detect invalid users/jobs/attempts", async () => {});
  it("Should detect event emissions and react to them", async () => {});
  it("Should process entire job, with waiting for response in idle", async () => {});
  it("Should store providerOperationId in database", async () => {});
  it("Should return completed job's data to user", async () => {});
});
