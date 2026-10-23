import { estimateCost } from "../../src/FinancesFeature/finService.js";

import { setupTestDB, teardownTestDB } from "../helpers/testDatabase.js";
let dbClient: Awaited<ReturnType<typeof setupTestDB>>;
beforeAll(async () => {
  dbClient = await setupTestDB();
});
afterAll(async () => {
  await teardownTestDB(dbClient);
});
beforeEach(async () => {
  await dbClient.query("BEGIN");
});
afterEach(async () => {
  await dbClient.query("ROLLBACK");
});
describe("Testing estimation on cost of job", () => {
  it("Should not accept invalid values", async () => {
    const invalidPrompt0 = "";
    const invalidPrompt1 = null;
    const invalidJobType0 = "";
    const invalidJobType1 = null;
    const invalidModel0 = "";
    const invalidModel1 = null;
    expect(async () => {
      await estimateCost(
        dbClient,
        invalidPrompt0,
        invalidJobType0,
        invalidModel1,
      );
    }).rejects.toThrow();
    expect(async () => {
      await estimateCost(
        dbClient,
        invalidPrompt1,
        invalidJobType1,
        invalidModel0,
      );
    }).rejects.toThrow();
  });
  it("should return a positive number", async () => {
    const prompt = "Hello, how are you?";
    const jobType = "code";
    const model = "gemma3b";
    const res = await estimateCost(dbClient, prompt, jobType, model);
    expect(typeof res.fullPrice).toBe("number");
    expect(res.fullPrice).toBeGreaterThan(0);
    expect(typeof res.inputPrice).toBe("number");
    expect(res.inputPrice).toBeGreaterThan(0);
    expect(typeof res.outputPrice).toBe("number");
    expect(res.outputPrice).toBeGreaterThan(0);
  });
  it("estimated cost should depend on length of prompt, context, and model", async () => {
    const prompt1 = "Null";
    const jobType1 = "SUMMARY";
    const model1 = "gemma3b";
    const res1 = await estimateCost(dbClient, prompt1, jobType1, model1);
    const prompt2 =
      "Some significantly longer prompt - like this one. What can you tell me about SQLite? Is it good? How much can you tell me?";
    const jobType2 = "CODE";
    const model2 = "gpt-5";
    const res2 = await estimateCost(dbClient, prompt2, jobType2, model2);
    expect(res2.fullPrice).toBeGreaterThan(res1.fullPrice);
  });
});
