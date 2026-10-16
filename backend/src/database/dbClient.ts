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
    const dbClient = client.connect(function (err) {
      if (err) throw err;
      client.query("SELECT VERSION()", [], function (err, result) {
        if (err) throw err;

        console.log(result.rows[0].version);
        console.log("Connected to the database");
        client.end(function (err) {
          if (err) throw err;
        });
      });
    });
    return dbClient;
  } catch (error) {
    throw error;
  }
}
export { connectDB };
