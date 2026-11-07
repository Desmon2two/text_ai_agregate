import { disconnectDB, setupTestDB } from "../helpers/testDatabase.js";
let dbClient: Awaited<ReturnType<typeof setupTestDB>>;
beforeAll(async () => {
  dbClient = await setupTestDB();
});
afterAll(async () => {
  await disconnectDB(dbClient);
});

describe("Testing attempt service", () => {
  it("Should not accept invalid inputs", async () => {});
  
});