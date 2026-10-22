import { dbConfigConstructor } from "./dbConfig.js";
import pg from "pg";
import fs from "fs";

async function connectDB(
  user: string,
  password: string,
  host: string,
  port: number,
  database: string,
) {
  const dbConfig = dbConfigConstructor(user, password, host, port, database, {
    rejectUnauthorized: true,
    ca: fs.readFileSync("./ca.pem").toString(),
  });

  const client = new pg.Client(dbConfig);

  try {
    await client.connect();

    const result = await client.query("SELECT VERSION()");
    console.log(result.rows[0].version);

    return client;
  } catch (error) {
    console.log("error during connection to db")
    throw error;
  }
}

export { connectDB };
