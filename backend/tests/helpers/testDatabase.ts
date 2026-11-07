import sqlite from "node:sqlite"
import dbTables from "../../src/database/dbTables.js";
async function setupTestDB(
) {
	const dbClient = new sqlite.DatabaseSync('./tests/helpers/testDB.sqlite')
	console.log(dbClient.prepare('SELECT sqlite_version() aS version').run());
	await dbTables.createRequiredTables(dbClient)
	console.log("Database connected")
	return dbClient
};
async function disconnectDB(dbClient) {
	await dbClient.close()
	console.log("Database disconnected")
}
export { setupTestDB, disconnectDB };
