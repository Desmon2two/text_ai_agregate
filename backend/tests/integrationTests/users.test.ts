import userRepository from "../../src/userFeature/userRepository.js";
import { setupTestDB, teardownTestDB } from "../helpers/testDatabase.js";
let dbClient: Awaited<ReturnType<typeof setupTestDB>>;
beforeAll(async () => {
  dbClient = await setupTestDB();
});
afterAll(async () => {
  await teardownTestDB(dbClient);
});
let userId: string;
describe("Testing users repository", () => {
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
  it("Should delete users", async () => {
    const res = await userRepository.deleteUser(dbClient, userId);
    expect(res.rowCount).toBe(1);
  });
  it("Should find users", async () => {});

});
