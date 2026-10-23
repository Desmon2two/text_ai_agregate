import finRepository from "../../src/FinancesFeature/finRepository.js";

import { setupTestDB, teardownTestDB } from "../helpers/testDatabase.js";
let dbClient: Awaited<ReturnType<typeof setupTestDB>>;
beforeAll(async () => {
  dbClient = await setupTestDB();
});
afterAll(async () => {
  await teardownTestDB(dbClient);
});

describe("Testing queue service", () => {
  it("should not accept invalid inputs but not break if encountered one", async () => {});
  it("should accept multiple jobs and dispatch them to workers one by one", async () => {});
  it("should have queue for whole jobs processing", async () => {});
  it("should have queue for recovery", async () => {});
});
