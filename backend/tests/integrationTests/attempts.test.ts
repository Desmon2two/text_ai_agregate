import attemptRepository from "../../src/jobFeature/attemptRepository.js";
import { setupTestDB, teardownTestDB } from "../helpers/testDatabase.js";
let dbClient: Awaited<ReturnType<typeof setupTestDB>>;
beforeAll(async () => {
  dbClient = await setupTestDB();
});
afterAll(async () => {
    await teardownTestDB(dbClient);
});

let attemptId: string;

describe("Testing attempt creation and deletion", () => {
  it(" Should create attempts", async () => {
    const attempt = {
      dbClient,
      job_id: "344a3733-1f79-407b-a70c-b90781688b50",
      attemptNumber: 1,
      provider: "test",
      model: "test",
    };
    const result = await attemptRepository.createAttempt(attempt);
    attemptId = result.attempt_id;
    expect(result?.attempt_id).not.toBeNull();
  });
  it('Should delete attempts', async ()=>{
    const res = await attemptRepository.deleteAttempt(dbClient, attemptId);
    expect(res.rowCount).toBe(1)
  })
});
