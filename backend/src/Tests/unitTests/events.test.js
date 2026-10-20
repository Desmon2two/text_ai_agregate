import { dbClient } from "../../server";
import eventRepository from "../../jobFeature/eventRepository";

describe("Events testing", () => {
  it(" Should create events", async () => {
    const result = await eventRepository.createAttemptCreatedEvent(
      dbClient,
      123,
      {
        origin: "Testing",
      },
    );
    expect(result).not.toBeNull();
    await eventRepository.deleteEvent(dbClient, result.event_id, {
      reason: "Testing",
    });
    dbClient.end();
  });
});
