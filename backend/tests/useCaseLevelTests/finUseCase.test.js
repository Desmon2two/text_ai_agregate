import finRepository from "../../src/FinancesFeature/finRepository.js";
import finUseCase from "../../src/FinancesFeature/finUseCase.js";
import eventRepository from "../../src/jobFeature/eventRepository.js";
import { createTestJob, createTestUser } from "../helpers/factoryFunctions.js";
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
describe("Testing financial use case", () => {
    const { job_id } = createTestJob();
    const { user_id } = createTestUser();
    it("Should not accept invalid inputs", async () => {
        await expect(finUseCase.changeCreditsOnJobCompletion(dbClient, "TotalyNonExistantJobId")).rejects.toThrow();
    });
    it("Should not accept NULL or empty", async () => {
        await expect(finUseCase.changeCreditsOnJobCompletion(dbClient, "")).rejects.toThrow("Invalid job_id input");
        await expect(finUseCase.changeCreditsOnJobCompletion(dbClient, null)).rejects.toThrow("Invalid job_id input");
    });
    it("Should fetch job", async () => {
        await expect(finUseCase.changeCreditsOnJobCompletion(dbClient, "TotalyNonExistantJobId")).rejects.toThrow();
        await expect(finUseCase.changeCreditsOnJobCompletion(dbClient, job_id)).rejects.toThrow("Can't process incomplete job");
    });
    it("Should calculate the difference", async () => {
        const job = dbClient.prepare(`INSERT INTO jobs
			(user_id, state, type, estimated_cost, actual_cost)
			VALUES (
		   ?1, ?2, ?3, ?4, ?5
      ) RETURNING *`).get(user_id, 'COMPLETED', 'SUMMARY', 143, 200);
        const res = await finUseCase.changeCreditsOnJobCompletion(dbClient, job.job_id);
        expect(res?.difference).toBe(-57);
    });
    it("Should refund credits if the difference is positive", async () => {
        const currCredits = await finRepository.getCreditsOfUser(dbClient, user_id);
        const job = dbClient.prepare(`INSERT INTO jobs
			(user_id, state, type, estimated_cost, actual_cost)
			VALUES (
		   ?1, ?2, ?3, ?4, ?5
      ) RETURNING *`).get(user_id, 'COMPLETED', 'SUMMARY', 143, 200);
        const { difference } = await finUseCase.changeCreditsOnJobCompletion(dbClient, job.job_id);
        const res = await finRepository.getCreditsOfUser(dbClient, user_id);
        const awaited = currCredits + difference;
        expect(res).toBe(awaited);
    });
    it("Should deduct credits if the difference is negative", async () => {
        const credits = await finRepository.getCreditsOfUser(dbClient, user_id);
        const job = dbClient.prepare(`INSERT INTO jobs
			(user_id, state, type, estimated_cost, actual_cost)
			VALUES (
		   ?1, ?2, ?3, ?4, ?5
      ) RETURNING *`).get(user_id, 'COMPLETED', 'SUMMARY', 200, 241);
        const { difference } = await finUseCase.changeCreditsOnJobCompletion(dbClient, job.job_id);
        const res = await finRepository.getCreditsOfUser(dbClient, user_id);
        const awaited = credits - difference;
        expect(res).toBe(awaited);
    });
    it("Should create financial events", async () => {
        const job = dbClient.prepare(`INSERT INTO jobs
			(user_id, state, type, estimated_cost, actual_cost)
			VALUES (
		   ?1, ?2, ?3, ?4, ?5
      ) RETURNING *`).get(user_id, 'COMPLETED', 'SUMMARY', 150, 149);
        const { job_id } = job;
        const { event_id, difference } = await finUseCase.changeCreditsOnJobCompletion(dbClient, job_id);
        console.log(event_id);
        const event = await eventRepository.getEventById(dbClient, event_id);
        console.log(event);
        expect(event.metadata.reason).toBe("REFUND_ON_JOB_COMPLETION");
        expect(event.metadata.amount).toBe(difference);
    });
});
