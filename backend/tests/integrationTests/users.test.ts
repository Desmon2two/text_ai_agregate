import userRepository from "../../src/userFeature/userRepository.js";
import { setupTestDB, teardownTestDB } from "../helpers/testDatabase.js";
let dbClient: Awaited<ReturnType<typeof setupTestDB>>;
beforeAll(async () => {
  dbClient = await setupTestDB();
});
afterAll(async () => {
  try {
    await userRepository.deleteUser(dbClient, userId);
    console.log("Test user was deleted");
  } finally {

    await teardownTestDB(dbClient);
  }
});
let userId: string;
describe("Testing users creation and deletion", () => {
  it("should create users", async () => {
    const user = await userRepository.createUser(
      dbClient,
      "uniqueEmail@gmail.com",
      "uniquePassword",
    );
    userId = user?.user_id;
    expect(user?.email).toBe("uniqueEmail@gmail.com");
    expect(user?.password).toBe("uniquePassword");
  });
});
