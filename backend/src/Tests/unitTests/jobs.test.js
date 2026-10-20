import jobRepository from "../../jobFeature/jobRepository";
import { dbClient, shutdown } from "../../server";
import { createUser } from "../../userFeature/userRepository";

afterAll(async () => {
  await shutdown();
});

describe("Jobs testing", () => {
  it(" Should create jobs", async () => {
    const user = await createUser(dbClient, "test@gmail.com", "testPassword");
    const result = await jobRepository.createJob(
      dbClient,
      "SUMMARY",
      {
        origin: "Testing",
      },
      user.user_id,
      1,
    );
    expect(result).not.toBeNull();
    await jobRepository.deleteJob(dbClient, result.job_id, {
      reason: "Testing",
    });
    dbClient.end();
  });
});
