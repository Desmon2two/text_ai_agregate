import eventRepository from "../../src/jobFeature/eventRepository.js";

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
  const user_id = "c9593f4e-142f-4bff-9c45-5fabb90f45f9"
  const attempt_id = "172f33e9-85e4-46f0-aa25-723072f0a295"

describe("Testing event creation and deletion", () => {
  it(" Should create and delete events", async () => {
    const res = await eventRepository.createAttemptCreatedEvent(
      dbClient,
      attempt_id,
      { origin: "testing" },
    );
    expect(res.name).toBe("ATTEMPT_CREATED");
    const res1 = await eventRepository.createCreditsAddedEvent(
      dbClient,
      user_id,
      { reason: "testing", amount: 150 },
    );
    expect(res1.name).toBe("CREDITS_ADDED");
    const res2 = await eventRepository.createCreditsDeductedEvent(
      dbClient,
      user_id,
      { reason: "testing", amount: 150 },
    );
    expect(res2.name).toBe("CREDITS_DEDUCTED");
    const result = await eventRepository.deleteEvent(dbClient, res.event_id);
    expect(result.rowCount).toBe(1);
    const result1 = await eventRepository.deleteEvent(dbClient, res1.event_id);
    expect(result1.rowCount).toBe(1);
    const result2 = await eventRepository.deleteEvent(dbClient, res2.event_id);
    expect(result2.rowCount).toBe(1);
  });

});
