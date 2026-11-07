import { disconnectDB, setupTestDB } from "../helpers/testDatabase.js";
let dbClient: Awaited<ReturnType<typeof setupTestDB>>;
beforeAll(async () => {
	dbClient = await setupTestDB();
});
afterAll(async () => {
	await disconnectDB(dbClient);
});
it("connects and returns the current database", async () => {
	const link = await dbClient.prepare("SELECT sqlite_version() AS name").run()
	console.log(link)
	expect(link).not.toBeNull();
});
it("can execute a parameterized exec", async () => {
	const link = await dbClient.prepare("SELECT $1::int AS value", [42]);

	expect(result.rows[0].value).toBe(42);
});
