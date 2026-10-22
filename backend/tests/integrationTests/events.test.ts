import eventRepository from "../../src/jobFeature/eventRepository.js";

import { setupTestDB, teardownTestDB } from "../helpers/testDatabase.js";
let dbClient: Awaited<ReturnType<typeof setupTestDB>>;
beforeAll(async () => {
  dbClient = await setupTestDB();
});
afterAll(async () => {
  await teardownTestDB(dbClient);
});

let eventId: string;
let eventId1: string;
let eventId2: string;
  const user_id = "c9593f4e-142f-4bff-9c45-5fabb90f45f9"
  const attempt_id = "172f33e9-85e4-46f0-aa25-723072f0a295"

describe("Testing event creation and deletion", () => {
  it(" Should create events", async () => {
    const result = await eventRepository.createAttemptCreatedEvent(
      dbClient,
      attempt_id,
      { origin: "testing" },
    );
    eventId = result.event_id;
    expect(result.name).toBe("ATTEMPT_CREATED");
    const res1 = await eventRepository.createCreditsAddedEvent(
      dbClient,
      user_id,
      { reason: "testing", amount: 150 },
    );
    eventId1 = res1.event_id;
    expect(res1.name).toBe("CREDITS_ADDED");
    const res2 = await eventRepository.createCreditsDeductedEvent(
      dbClient,
      user_id,
      { reason: "testing", amount: 150 },
    );
    eventId2 = res2.event_id;
    expect(res2.name).toBe("CREDITS_DEDUCTED");
  });

  it("Should delete events", async () => {
    const res = await eventRepository.deleteEvent(dbClient, eventId);
    expect(res.rowCount).toBe(1);
    const res1 = await eventRepository.deleteEvent(dbClient, eventId1);
    expect(res1.rowCount).toBe(1);
    const res2 = await eventRepository.deleteEvent(dbClient, eventId2);
    expect(res2.rowCount).toBe(1);
  });
});
