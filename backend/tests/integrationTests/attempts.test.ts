import attemptRepository from "../../src/jobFeature/attemptRepository.js";
import { setupTestDB, teardownTestDB } from "../helpers/testDatabase.js";
import { createTestAttempt } from "../helpers/factoryFunctions.js";
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

describe("Testing attempt repository", () => {
  it(" Should create attempts", async () => {
    const { attempt_id, attempt_number, provider, model } = createTestAttempt();
    const result = await attemptRepository.createAttempt(
      dbClient,
      attempt_id,
      attempt_number,
      provider,
      model,
    );
    expect(result?.attempt_id).not.toBeNull();
  });
  it("Should delete attempts", async () => {
    const { attempt_id, attempt_number, provider, model } = createTestAttempt();
    await attemptRepository.createAttempt(
      dbClient,
      attempt_id,
      attempt_number,
      provider,
      model,
    );
    const res = await attemptRepository.deleteAttempt(dbClient, attempt_id);
    expect(res.rowCount).toBe(1);
  });
  it("Should complete attempts", async () => {
    const attempt = createTestAttempt({
      state: "VALIDATED",
      data: {
        tokens: { input_tokens: 5, output_tokens: 12 },
        received_data: "actually something",
      },
    });

    const result = await attemptRepository.markCompleted(
      dbClient,
      attempt.attempt_id,
      attempt.data,
    );
    expect(result?.data?.received_data).toBe("actually something");
  });
  it("Should not allow invalid state transitions", async () => {
    const attempt = createTestAttempt({
      state: "COMPLETED",
      data: {
        tokens: { input_tokens: 5, output_tokens: 12 },
        received_data: "actually something",
      },
    });
    const attempt2 = createTestAttempt({
      state: "CREATED",
      data: {
        tokens: { input_tokens: 5, output_tokens: 12 },
        received_data: "actually something",
      },
    });

    const result = await attemptRepository.markCompleted(
      dbClient,
      attempt.attempt_id,
      attempt.data,
    );
    const result2 = await attemptRepository.markCompleted(
      dbClient,
      attempt2.attempt_id,
      attempt2.data,
    );
    expect(result).toBeNull();
    expect(result2).toBeNull();
  });
  it("Should not allow completion without data present", async () => {
        const attempt = createTestAttempt({
      state: "COMPLETED",
      data: {
        tokens: { input_tokens: 5, output_tokens: 12 },
        received_data: null,
      },
    });

    expect(      
      await attemptRepository.markCompleted(
      dbClient,
      attempt.attempt_id,
      attempt.data?.received_data,
    )).rejects.toThrow("Data can't be null while completing attempt");
  });
});
