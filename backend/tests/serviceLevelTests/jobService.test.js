import { disconnectDB, setupTestDB } from "../helpers/testDatabase.js";
let dbClient;
beforeAll(async () => {
    dbClient = await setupTestDB();
});
afterAll(async () => {
    await disconnectDB(dbClient);
});
describe("Testing basic workers", () => {
    it("Should not accept invalid inputs", async () => { });
});
