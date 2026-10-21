import localAiService from "../../src/aiFeature/aiServices/localAiService.js";

// import { setupTestDB, teardownTestDB } from "../helpers/testDatabase.js";
// let dbClient: Awaited<ReturnType<typeof setupTestDB>>;
// beforeAll(async () => {
//   dbClient = await setupTestDB();
// });
// afterAll(async () => {
//   await teardownTestDB(dbClient);
// });

// let jobId: string;
// let attemptId: string;
// let eventsIds: string[];

describe("Local model test", () => {
  it(" Should accept inputs and return answers", async () => {
    const result = await localAiService.acceptJob("explain jest database in 15 fish");
    console.log(result);
    expect(result).not.toBeNull();
  }, 120000);
});
