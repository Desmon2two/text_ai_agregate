import { connectDB } from "../../src/database/dbClient.js";
import dotenv from "dotenv";
dotenv.config({ path: ".env", quiet: true });
export async function setupTestDB() {
    return await connectDB(process.env.PGUSER, process.env.PGPASSWORD, process.env.PGHOST, process.env.PGPORT, process.env.PGDATABASE);
}
export async function teardownTestDB(dbClient) {
    if (!dbClient.ended) {
        await dbClient.end();
    }
    console.log("Connection to DB terminated");
}
