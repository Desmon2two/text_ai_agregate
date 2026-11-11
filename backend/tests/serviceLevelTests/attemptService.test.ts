import { disconnectDB, setupDB } from "../../src/database/dbClient.js";
let dbClient: Awaited<ReturnType<typeof setupDB>>;
beforeAll(async () => {
  dbClient = await setupDB();
});
afterAll(async () => {
  await disconnectDB(dbClient);
});

describe("Testing attempt service", () => {
  it("Should not accept invalid inputs", async () => {});
  
});