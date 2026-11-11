import { disconnectDB, setupDB, testClient } from "../../src/database/dbClient.js";
let dbClient;
beforeAll(async () => {
    await setupDB();
    dbClient = testClient.getConnection();
});
afterAll(async () => {
    await disconnectDB(dbClient);
});
it("connects and returns the current database", async () => {
    const link = await dbClient.prepare("SELECT sqlite_version() AS name").get();
    console.log(link.name);
    expect(link.name).not.toBeNull();
});
it("can execute a parameterized query", async () => {
    const link = await dbClient.prepare("SELECT ? AS value").get(42);
    expect(link.value).toBe(42);
});
