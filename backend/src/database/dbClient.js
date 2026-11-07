import sqlite from "node:sqlite";
import dbTables from "../database/dbTables.js";
async function setupTestDB() {
    const dbClient = new sqlite.DatabaseSync('./src/database/DB.sqlite');
    console.log(dbClient.prepare('SELECT sqlite_version() AS version').get());
    await dbTables.createRequiredTables(dbClient);
    console.log("Database connected");
    return dbClient;
}
;
async function disconnectDB(dbClient) {
    await dbClient.close();
    console.log("Database disconnected");
}
export { setupTestDB, disconnectDB };
