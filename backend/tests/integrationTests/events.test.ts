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

describe("Testing event creation and deletion", () => {
  it(" Should create events", async () => {
    const result = await eventRepository.createAttemptCreatedEvent(
      dbClient,
      "172f33e9-85e4-46f0-aa25-723072f0a295",
      { origin: "testing" },
    );
    eventId = result.event_id;
    expect(result).not.toBeNull();
  });
  it("Should delete events", async () => {
    const res = await eventRepository.deleteEvent(dbClient, eventId);
    expect(res.rowCount).toBe(1);
  });
});
