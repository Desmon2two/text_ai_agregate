import sqlite from "node:sqlite"
import dbTables from "../database/dbTables.js";
let dbClient;
async function connectDB(
) {
  dbClient = new sqlite.DatabaseSync('./src/database/DB.sqlite')
console.log(dbClient.prepare('SELECT sqlite_version() AS version').get());
await dbTables.createRequiredTables(dbClient) 
console.log("Database connected")
};
export { connectDB, dbClient };
