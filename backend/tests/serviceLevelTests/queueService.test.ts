import queueService from "../../src/queue/queueService.js";
import { setupTestDB, teardownTestDB } from "../helpers/testDatabase.js";

afterAll(async () => {
    await queueService.dispatchQueue.obliterate({force: true})
    await queueService.recoveryQueue.obliterate({force: true})
  await queueService.disconnectQueue(queueService.dispatchQueue);
  await queueService.disconnectQueue(queueService.recoveryQueue);
});

describe("Testing queue service", () => {
  it("should connect to redis running in docker", async () => {
    const result = await queueService.addJobToDispatchQueue();
    expect(result.name).toBe("dispatchJob");
  });
  it("should accept jobs", async () => {
    const result = await queueService.addJobToDispatchQueue(null, {job_id: null, attempt_id: null, 
      foo: "bar",
    });
    expect(result.name).toBe("dispatchJob");
    expect(result.data.foo).toBe("bar");
  });
  it("should have queue for whole jobs processing", async () => {
        const result = await queueService.addJobToDispatchQueue();
    expect(result.name).toBe("dispatchJob");
  });
  it("should have queue for recovery", async () => {
        const result = await queueService.addJobToRecoveryQueue();
    expect(result.name).toBe("recoveryJob");
  });
});
