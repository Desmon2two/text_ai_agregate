import { setupTestDB, teardownTestDB } from "../helpers/testDatabase.js";
let dbClient: Awaited<ReturnType<typeof setupTestDB>>;
beforeAll(async () => {
  dbClient = await setupTestDB();
});
afterAll(async () => {
  await teardownTestDB(dbClient);
});
it("connects and returns the current database", async () => {
  const link = await dbClient.prepare("SELECT current_database() AS name");

  expect(result.rows).toHaveLength(1);
  expect(result.rows[0].name).not.toBeNull();
});
it("can execute a parameterized query", async () => {
  const link = await dbClient.prepare("SELECT $1::int AS value", [42]);

  expect(result.rows[0].value).toBe(42);
});
