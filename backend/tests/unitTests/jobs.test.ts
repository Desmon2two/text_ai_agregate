import { expectFailure } from "node:test";
import jobRepository from "../../src/jobFeature/jobRepository.js";
import { dbClient, shutdown } from "../../src/server.js";
import { createUser } from "../../src/userFeature/userRepository.js";

describe("Jobs testing", () => {
  afterAll(async () => {
    await shutdown();
  });
  it("connects and returns the current database", async () => {
    const result = await dbClient.query("SELECT current_database() AS name");

    expect(result.rows).toHaveLength(1);
    expect(result.rows[0].name).not.toBeNull();
  });

  it("can execute a parameterized query", async () => {
    const result = await dbClient.query("SELECT $1::int AS value", [42]);

    expect(result.rows[0].value).toBe(42);
  });
  // describe("should be able to create users", async ()=>{
  //   it("should not create empty users", async ()=>{
  //     const user = await userRepository.createUser(dbClient, '', '')
  //     expectFailure()
  //   })
  // })
  // it(" Should create jobs", async () => {
  //   const user = await createUser(dbClient, "test@gmail.com", "testPassword");
  //   const result = await jobRepository.createJob(
  //     dbClient,
  //     "SUMMARY",
  //     {
  //       origin: "Testing",
  //     },
  //     user.user_id,
  //     1,
  //   );
  //   expect(result).not.toBeNull();
  //   await jobRepository.deleteJob(dbClient, result.job_id, {
  //     reason: "Testing",
  //   });
  // });
});
