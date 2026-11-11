import { disconnectDB, setupDB } from "../../src/database/dbClient.js";
let dbClient;
beforeAll(async () => {
    dbClient = await setupDB();
});
afterAll(async () => {
    await disconnectDB(dbClient);
});
describe("Testing recovery workers", () => {
    it("Should not accept invalid inputs", async () => { });
    it("Should accept stale attempts", async () => { });
    it("Should detect invalid users/jobs/attempts", async () => { });
    it("Should decide what to do with them, then do it", async () => { });
    it("Should recover them according to policy", async () => { });
    it("Should create recovery events trail that allows to see what happened", async () => { });
});
