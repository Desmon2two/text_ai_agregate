import { estimateCost } from "../../src/FinancesFeature/finService.js";
import { setupTestDB, teardownTestDB } from "../helpers/testDatabase.js";
let dbClient: Awaited<ReturnType<typeof setupTestDB>>;
beforeAll(async () => {
  dbClient = await setupTestDB();
});
afterAll(async () => {
  await teardownTestDB(dbClient);
});

describe("Testing financial service level functionality", () => {
  it("Should consistently calculate prices", async () => {
    const prompt = "This is a test prompt. Give back a 100 random words.";
    const result = await estimateCost(dbClient, prompt, "QUESTION", "gpt-5");
    console.log(result);
    expect(result.fullPrice).toBeCloseTo(0.21);
  });
  it("Should have expanded functionality", async () => {});
});
