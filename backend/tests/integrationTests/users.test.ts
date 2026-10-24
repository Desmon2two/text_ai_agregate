import userRepository from "../../src/userFeature/userRepository.js";
import { createTestUser } from "../helpers/factoryFunctions.js";
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
describe("Testing users repository", () => {
  const {user_id} = createTestUser()
  it("should create users", async () => {
    const user = await userRepository.createUser(
      dbClient,
      "uniqueEmail@gmail.com",
      "uniquePassword",
    );
    expect(user?.email).toBe("uniqueEmail@gmail.com");
    expect(user?.password).toBe("uniquePassword");
  });
  it("Should delete users", async () => {
    const res = await userRepository.deleteUser(dbClient, user_id);
    expect(res.rowCount).toBe(1);
  });
  it("Should find users", async () => {
    const result = await userRepository.getUserById(dbClient, user_id);
    expect(result?.user_id).toBe(user_id)
  });

});
