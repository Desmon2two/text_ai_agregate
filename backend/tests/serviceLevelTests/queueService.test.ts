import queueService from "../../src/queue/queueService.js";
import { setupTestDB, teardownTestDB } from "../helpers/testDatabase.js";
let dbClient: Awaited<ReturnType<typeof setupTestDB>>;

afterAll(async () => {
  await queueService.disconnectQueue();
});

describe("Testing queue service", () => {
  it("should connect to redis running in docker", async () => {
    const result = await queueService.addJobToDispatchQueue();
    expect(result.name).toBe("myJob");
  });
  it("should not accept invalid inputs but not break if encountered one", async () => {});
  it("should accept jobs", async () => {
    const result = await queueService.addJobToDispatchQueue("test", {
      foo: "bar",
    });
    expect(result.name).toBe("test");
    expect(result.data.foo).toBe("bar");
  });
  it("should have queue for whole jobs processing", async () => {});
  it("should have queue for recovery", async () => {});
});
