import finRepository from "../../src/FinancesFeature/finRepository.js";
import { createTestUser } from "../helpers/factoryFunctions.js";
import { disconnectDB, setupTestDB } from "../helpers/testDatabase.js";
let dbClient;
beforeAll(async () => {
    dbClient = await setupTestDB();
});
afterAll(async () => {
    await disconnectDB(dbClient);
});
beforeEach(async () => {
    await dbClient.exec("BEGIN");
});
afterEach(async () => {
    await dbClient.exec("ROLLBACK");
});
describe("Testing financial repository", () => {
    const { user_id } = createTestUser();
    it("Should correctly fetch data from database", async () => {
        const result = await finRepository.getCostOfModel(dbClient, "gemma3b");
        expect(result.input_price_for_1m_tokens).toBe(10);
        expect(result.output_price_for_1m_tokens).toBe(150);
    });
    it("should get user's credits", async () => {
        const result = await finRepository.getCreditsOfUser(dbClient, user_id);
        expect(typeof result).toBe("number");
        expect(result).not.toBeNull();
    });
    it("should add credits", async () => {
        const curr = await finRepository.getCreditsOfUser(dbClient, user_id);
        const result = await finRepository.addCredits(dbClient, user_id, 150);
        console.log(curr);
        console.log(result);
        expect(typeof result).toBe("number");
        expect(result).not.toBeNull();
        expect(result).toBe(curr + result);
    });
    it("should deduct credits", async () => {
        const result = await finRepository.deductCredits(dbClient, user_id, 150);
        expect(typeof result).toBe("number");
        expect(result).not.toBeNull();
    });
    it("The addition and deduction should work correctly", async () => {
        const curr = await finRepository.getCreditsOfUser(dbClient, user_id);
        await finRepository.deductCredits(dbClient, user_id, curr);
        await finRepository.addCredits(dbClient, user_id, 180);
        await finRepository.deductCredits(dbClient, user_id, 150);
        const result = await finRepository.getCreditsOfUser(dbClient, user_id);
        await finRepository.deductCredits(dbClient, user_id, 30);
        expect(Number(result)).toBe(30);
    });
    it("Should support external atomic transactions wrapper", async () => {
        const currCredits = await finRepository.getCreditsOfUser(dbClient, user_id);
        await finRepository.addCredits(dbClient, user_id, 63);
        const resCredits = await finRepository.getCreditsOfUser(dbClient, user_id);
        expect(currCredits).toBe(resCredits);
    });
});
