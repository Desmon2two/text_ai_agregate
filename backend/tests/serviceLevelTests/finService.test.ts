import finService from "../../src/FinancesFeature/finService.js";
import { disconnectDB, setupDB } from "../../src/database/dbClient.js";
let dbClient: Awaited<ReturnType<typeof setupDB>>;
beforeAll(async () => {
	dbClient = await setupDB();
});
afterAll(async () => {
	await disconnectDB(dbClient);
});

const { estimateCost } = finService
describe("Testing financial service level functionality", () => {
	it("Should consistently calculate prices", async () => {
		const prompt = "This is a test prompt. Give back a 100 random words.";
		const result = await estimateCost(dbClient, prompt, "QUESTION", "gpt-5");
		console.log(result);
		expect(result.fullPrice).toBeCloseTo(0.21);
	});
	it("Should have expanded functionality", async () => { });
});
