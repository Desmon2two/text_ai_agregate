import sqlite from "node:sqlite";
import dbTables from "../database/dbTables.js";
async function setupDB() {
    const dbClient = new sqlite.DatabaseSync('./src/database/DB.sqlite');
    console.log(dbClient.prepare('SELECT sqlite_version() AS version').run());
    await dbTables.createRequiredTables(dbClient);
    console.log("Database connected");
    return dbClient;
}
;
async function disconnectDB(dbClient) {
    await dbClient.close();
    console.log("Database disconnected");
}
export { setupDB, disconnectDB };
