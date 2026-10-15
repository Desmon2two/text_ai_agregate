import dbClient from "../../database/dbClient";
import eventRepository from "../../jobFeature/eventRepository";

describe("Events testing", () => {
  it(" Should create events", () => {
    const result = eventRepository.createAttemptCreatedEvent(dbClient, 123, {
      origin: "Testing",
    });
    expect(result).toBe("Attempt");
  });
});
