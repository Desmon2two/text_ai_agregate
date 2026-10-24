import { dbConfigConstructor } from "./dbConfig.js";
import pg from "pg";
import fs from "fs";
async function connectDB(user, password, host, port, database) {
    const dbConfig = dbConfigConstructor(user, password, host, port, database, {
        rejectUnauthorized: true,
        ca: fs.readFileSync("./ca.pem").toString(),
    });
    const client = new pg.Client(dbConfig);
    try {
        await client.connect();
        console.log("Connected to db");
        return client;
    }
    catch (error) {
        console.log("error during connection to db");
        throw error;
    }
}
export { connectDB };
