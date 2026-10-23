import finRepository from "../../src/FinancesFeature/finRepository.js";
import finUseCase from "../../src/FinancesFeature/finUseCase.js";
import eventRepository from "../../src/jobFeature/eventRepository.js";
import { createTestJob } from "../helpers/factoryFunctions.js";
import { setupTestDB, teardownTestDB } from "../helpers/testDatabase.js";
let dbClient: Awaited<ReturnType<typeof setupTestDB>>;
beforeAll(async () => {
  dbClient = await setupTestDB();
}, 15000);
afterAll(async () => {
  await teardownTestDB(dbClient);
}, 15000);
beforeEach(async () => {
  await dbClient.query("BEGIN");
});
afterEach(async () => {
  await dbClient.query("ROLLBACK");
});

describe("Testing financial use case", () => {
  const {job_id} = createTestJob();
  const test_user_id = "c9593f4e-142f-4bff-9c45-5fabb90f45f9";
  it("Should not accept invalid inputs", async () => {
    await expect(
      finUseCase.changeCreditsOnJobCompletion(
        dbClient,
        "TotalyNonExistantJobId",
      ),
    ).rejects.toThrow();
  });
  it("Should not accept NULL or empty", async () => {
    await expect(
      finUseCase.changeCreditsOnJobCompletion(dbClient, ""),
    ).rejects.toThrow("Invalid job_id input");
    await expect(
      finUseCase.changeCreditsOnJobCompletion(dbClient, null),
    ).rejects.toThrow("Invalid job_id input");
  });
  it("Should fetch job", async () => {
    await expect(
      finUseCase.changeCreditsOnJobCompletion(
        dbClient,
        "TotalyNonExistantJobId",
      ),
    ).rejects.toThrow();
    await expect(
      finUseCase.changeCreditsOnJobCompletion(dbClient, job_id),
    ).rejects.toThrow("Can't process incomplete job");
  });
  it("Should calculate the difference", async () => {
    const job = await dbClient.query(
      `INSERT INTO jobs
      (user_id, state, type, estimated_cost, actual_cost)
       VALUES (
      'c9593f4e-142f-4bff-9c45-5fabb90f45f9',
      'COMPLETED',
      'SUMMARY',
      143,
      200
      ) RETURNING *`,
      [],
    );
    const res = await finUseCase.changeCreditsOnJobCompletion(
      dbClient,
      job.rows[0].job_id,
    );
    expect(res?.difference).toBe(-57);
  }, 60000);
  it("Should refund credits if the difference is positive", async () => {
    const currCredits = await finRepository.getCreditsOfUser(
      dbClient,
      test_user_id,
    );
    const job = await dbClient.query(
      `INSERT INTO jobs
      (user_id, state, type, estimated_cost, actual_cost)
       VALUES (
      'c9593f4e-142f-4bff-9c45-5fabb90f45f9',
      'COMPLETED',
      'SUMMARY',
      250,
      221
      ) RETURNING *`,
    );
    const { difference } = await finUseCase.changeCreditsOnJobCompletion(
      dbClient,
      job.rows[0].job_id,
    );
    const res = await finRepository.getCreditsOfUser(dbClient, test_user_id);
    const awaited = currCredits + difference;
    expect(res).toBe(awaited);
  }, 60000);
  it("Should deduct credits if the difference is negative", async () => {
    const credits = await finRepository.getCreditsOfUser(
      dbClient,
      test_user_id,
    );
    const job = await dbClient.query(
      `INSERT INTO jobs
      (user_id, state, type, estimated_cost, actual_cost)
       VALUES (
      'c9593f4e-142f-4bff-9c45-5fabb90f45f9',
      'COMPLETED',
      'SUMMARY',
      200,
      241
      ) RETURNING *`,
    );
    const { difference } = await finUseCase.changeCreditsOnJobCompletion(
      dbClient,
      job.rows[0].job_id,
    );
    const res = await finRepository.getCreditsOfUser(dbClient, test_user_id);
    const awaited = credits - difference;
    expect(res).toBe(awaited);
  }, 60000);
  it("Should create financial events", async () => {
    const job = await dbClient.query(
      `INSERT INTO jobs
      (user_id, state, type, estimated_cost, actual_cost)
       VALUES (
      'c9593f4e-142f-4bff-9c45-5fabb90f45f9',
      'COMPLETED',
      'SUMMARY',
      150,
      149
      ) RETURNING *`,
    );
    const { job_id } = job.rows[0];
    const { event_id, difference } =
      await finUseCase.changeCreditsOnJobCompletion(dbClient, job_id);
    console.log(event_id);
    const event = await eventRepository.getEventById(dbClient, event_id);
    console.log(event);
    expect(event.metadata.reason).toBe("REFUND_ON_JOB_COMPLETION");
    expect(event.metadata.amount).toBe(difference);
  });
});
