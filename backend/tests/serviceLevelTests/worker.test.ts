import { setupTestDB, teardownTestDB } from "../helpers/testDatabase.js";
let dbClient: Awaited<ReturnType<typeof setupTestDB>>;
beforeAll(async () => {
  dbClient = await setupTestDB();
});
afterAll(async () => {
  await teardownTestDB(dbClient);
});

describe("Testing basic workers", () => {
  it("Should not accept invalid inputs", async () => {});
  it("Should accept fresh jobs and start processing them", async () => {});
  it("Should accept fresh attempts and start processing them", async () => {});
  it("Should detect invalid users/jobs/attempts", async () => {});
  it("Should process entire job, with waiting for response in idle", async () => {});
  it("Should store providerOperationId in database", async () => {});
  it("Should return completed job's data to user", async () => {});
});
