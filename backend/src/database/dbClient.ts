import {Database} from "node:sqlite"
import dbTables from "../database/dbTables.js";
let dbClient;
async function connectDB(
) {
dbClient = new Database('./DB.sqlite')
await dbTables.createRequiredTables(dbClient) 
console.log("Database connected")
};
export { connectDB, dbClient };
