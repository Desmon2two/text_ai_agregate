import { createTestUser } from "../helpers/factoryFunctions.js";
import userRepository from "../../src/userFeature/userRepository.js";

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

describe("Testing user repository", () => {
  const { user_id, username, password, email } = createTestUser();
  describe("Testing finding users", () => {
    it("Should find user by id", async () => {
      const user = await userRepository.getUserById(dbClient, user_id);
      expect(user?.user_id).toBe(user_id);
    });
    it("Should find user by email", async () => {
      const user = await userRepository.getUserByEmail(dbClient, email);
      expect(user?.email).toBe(email);
    });
  });
  describe("Should create users", () => {
    it("Should not allow same emails", async () => {
      const user = await userRepository.createUser(
        dbClient,
        username,
        email,
        password,
      );
      expect(user).toBeNull();
    });
    it("Should create user", async () => {
      const user = await userRepository.createUser(
        dbClient,
        username,
        "TotatllyUniqueEmail@gmail.com",
        password,
      );
      expect(user.email).toBe("TotatllyUniqueEmail@gmail.com");
    });
  });
  it("Should delete users", async () => {
    const deleted = await userRepository.deleteUser(dbClient, user_id);
    expect(deleted).toBe(1);
  });
  describe("Testing update users", () => {
    it("Should update display data", async () => {
      const newUser = await userRepository.changeUserDisplayData(
        dbClient,
        user_id,
        "Totatlly new username",
      );
      expect(newUser.username).toBe("Totatlly new username");
    });
    it("Should update credentials", async () => {
      const newUserEmail = await userRepository.changeUserEmail(
        dbClient,
        user_id,
        "TotatllyNewEmail@gmail.com",
      );
      const newUserPassword = await userRepository.changeUserPassword(
        dbClient,
        user_id,
        "Totatlly new password",
      );
      expect(newUserEmail.email).toBe("TotatllyNewEmail@gmail.com");
      expect(newUserPassword.password).toBe("Totatlly new password");
    });
  });
});
