import { createTestUser } from "../helpers/factoryFunctions.js";
import userService from "../../src/userFeature/userService.js";

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

describe("Testing user service", () => {
  const testUser = createTestUser();
  describe("Should create / register / login / delete users", () => {
    it("Should not accept invalid inputs", async () => {
      expect(
        await userService.registerUser(dbClient, null, null, null),
      ).rejects.toThrow();
      expect(
        await userService.registerUser(dbClient, "", "", ""),
      ).rejects.toThrow();
      expect(
        await userService.registerUser(dbClient, null, null, ""),
      ).rejects.toThrow();
      expect(
        await userService.registerUser(dbClient, null, "", null),
      ).rejects.toThrow();
      expect(
        await userService.registerUser(dbClient, "", null, null),
      ).rejects.toThrow();
      expect(
        await userService.registerUser(
          dbClient,
          "kindaDecentEmail@gmail.com",
          null,
          null,
        ),
      ).rejects.toThrow();
      expect(
        await userService.registerUser(
          dbClient,
          "kindaDecentEmail@gmail.com",
          "KindaDecentPassword",
          null,
        ),
      ).rejects.toThrow();
      expect(
        await userService.registerUser(
          dbClient,
          "NotDecentEmail",
          "KindaDecentPassword",
          "ValidUsername",
        ),
      ).rejects.toThrow();
    });
    it("Should register users", async () => {
      const { user } = await userService.registerUser(
        dbClient,
        "NewAndUniqueEmail@gmail.com",
        testUser.password,
        testUser.username,
      );
      expect(user.email).toBe("NewAndUniqueEmail@gmail.com");
    });
    it("Should login users", async () => {
      const { user_id } = await userService.loginUser(
        dbClient,
        testUser.email,
        testUser.password,
      );
      expect(user_id).toBe(testUser.user_id);
    });
  });
  describe("Should find users", () => {
    it("Should not accept invalid inputs", async () => {
      expect(
        await userService.getCurrentUser(dbClient, null, null),
      ).rejects.toThrow();
      expect(
        await userService.getCurrentUser(dbClient, "nonExistatnEmail", null),
      ).rejects.toThrow();
      expect(
        await userService.getCurrentUser(dbClient, null, "nonEsixtansId"),
      ).rejects.toThrow();
      expect(
        await userService.getCurrentUser(dbClient, "", ""),
      ).rejects.toThrow();
    });
    it("Should find users by email", async () => {
      const { email } = await userService.getCurrentUser(
        dbClient,
        null,
        testUser.email,
      );
      expect(email).toBe(testUser.email);
    });
    it("Should find users by id", async () => {
      const { user_id } = await userService.getCurrentUser(
        dbClient,
        testUser.user_id,
        null,
      );
      expect(user_id).toBe(testUser.user_id);
    });
    it("Should be able to refresh access tokens", async () => {});
  });

  describe("Should allow to change user's data", () => {
    it("Should not accept invalid inputs", async () => {
      expect(
        await userService.patchUserEmail(
          dbClient,
          testUser.user_id,
          testUser.password,
          "",
        ),
      ).rejects.toThrow();
      expect(
        await userService.patchUserEmail(
          dbClient,
          testUser.user_id,
          testUser.password,
          null,
        ),
      ).rejects.toThrow();
      expect(
        await userService.patchUserEmail(
          dbClient,
          testUser.user_id,
          testUser.password,
          "Some absolutely obscene and t0tally impossiblep email to habe !!!!!!",
        ),
      ).rejects.toThrow();
      expect(
        await userService.patchUserEmail(
          dbClient,
          testUser.user_id,
          testUser.password,
          "notAnEmail@",
        ),
      ).rejects.toThrow();
      expect(
        await userService.patchUserEmail(
          dbClient,
          testUser.user_id,
          testUser.password,
          "notAnEmail2.",
        ),
      ).rejects.toThrow();
      expect(
        await userService.patchUserPassword(
          dbClient,
          testUser.user_id,
          null,
          testUser.email,
        ),
      ).rejects.toThrow();
      expect(
        await userService.patchUserPassword(
          dbClient,
          testUser.user_id,
          "",
          testUser.email,
        ),
      ).rejects.toThrow();
      expect(
        await userService.patchUserPassword(
          dbClient,
          testUser.user_id,
          "TYupi literrally can't have that password, right? I mean it would be crazy to even thing about it!",
          testUser.email,
        ),
      ).rejects.toThrow();
    });
    it("Should allow to change username", async () => {});
    it("Should allow to change email", async () => {
      await userService.patchUserEmail(
        dbClient,
        testUser.user_id,
        testUser.password,
        "TotallyNewAndUniqueEmail@gmail.com",
      );
      const { email } = await userService.getCurrentUser(
        dbClient,
        testUser.user_id,
      );
      expect(email).toBe("TotallyNewAndUniqueEmail@gmail.com");
    });
    it("Should allow to change password", async () => {
      await userService.patchUserPassword(
        dbClient,
        testUser.user_id,
        testUser.password,
        "TotallyNewAndUniquePassword",
      );
      const { password } = await userService.getCurrentUser(
        dbClient,
        testUser.user_id,
      );
      expect(password).toBe("TotallyNewAndUniquePassword");
    });
  });
});
