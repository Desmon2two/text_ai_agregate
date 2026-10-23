import { setupTestDB, teardownTestDB } from "../helpers/testDatabase.js";
let dbClient: Awaited<ReturnType<typeof setupTestDB>>;
beforeAll(async () => {
  dbClient = await setupTestDB();
});
afterAll(async () => {
  await teardownTestDB(dbClient);
});

describe("Testing user service", () => {
  it("Should not accept invalid inputs", async () => {});
  it("Should uphold business rules while operating", async () => {});
  it("Should uphold technical rules while operating", async () => {});
  it("Should create users", async () => {});
  it("Should register users", async () => {});
  it("Should login users", async () => {});
  it("Should allow to change user's data", async () => {});
  
});