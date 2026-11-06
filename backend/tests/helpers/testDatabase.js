import { connectDB } from "../../src/database/dbClient.js";
export async function setupTestDB() {
    return await connectDB();
}
export async function teardownTestDB(dbClient) {
    await dbClient.end();
    console.log("Connection to DB terminated");
}
