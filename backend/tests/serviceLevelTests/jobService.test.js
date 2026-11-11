import { disconnectDB, setupDB } from "../../src/database/dbClient.js";
let dbClient;
beforeAll(async () => {
    dbClient = await setupDB();
});
afterAll(async () => {
    await disconnectDB(dbClient);
});
describe("Testing basic workers", () => {
    it("Should not accept invalid inputs", async () => { });
});
