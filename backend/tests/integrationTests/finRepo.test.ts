import finRepository from "../../src/FinancesFeature/finRepository.js";

import { setupTestDB, teardownTestDB } from "../helpers/testDatabase.js";
let dbClient: Awaited<ReturnType<typeof setupTestDB>>;
beforeAll(async () => {
  dbClient = await setupTestDB();
});
afterAll(async () => {
  await teardownTestDB(dbClient);
});

describe("Testing financial repository", () => {
  const user_id = "c9593f4e-142f-4bff-9c45-5fabb90f45f9";
  it("Should correctly fetch data from database", async () => {
    const result = await finRepository.getCostOfModel(dbClient, "gemma3b");
    expect(result.input_price_for_1m_tokens).toBe(10);
    expect(result.output_price_for_1m_tokens).toBe(150);
  });
  it("should get user's credits", async () => {
    const result = await finRepository.getCreditsOfUser(dbClient, user_id);
    expect(result.credits).not.toBeNull();
  });
  it("should add credits", async () => {
    const result = await finRepository.addCredits(dbClient, user_id, 150);
    expect(result.credits).not.toBeNull();
  });
  it("should deduct credits", async () => {
    const result = await finRepository.deductCredits(dbClient, user_id, 150);
    expect(result.credits).not.toBeNull();
  });
  it("The addition and deduction should work correctly", async () => {
    const curr = await finRepository.getCreditsOfUser(dbClient, user_id);
    console.log("Current:", curr.credits);
    await finRepository.deductCredits(dbClient, user_id, curr.credits);
    console.log("Full credits deducted");
    await finRepository.addCredits(dbClient, user_id, 180);
    await finRepository.deductCredits(dbClient, user_id, 150);
    console.log("Basic operations complete");
    const result = await finRepository.getCreditsOfUser(dbClient, user_id);
    console.log("Result credits get:", result.credits);
    await finRepository.deductCredits(dbClient, user_id, 30);
    expect(Number(result.credits)).toBe(30);
  });
});
