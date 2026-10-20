import dotenv from "dotenv";
import dns from "node:dns";
dns.setDefaultResultOrder("ipv4first");

import { connectDB } from "./database/dbClient.js";
import express from "express";

const app = express();
dotenv.config({ path: ".env" });
const PORT = process.env.PORT || 3000;

// MIDDLEWARE
app.use(express.json());

// MOUNTING ROUTERS

// ERROR HANDLER

// DATABASE THEN SERVER START
let dbClient;
try {
  const client = await connectDB(
    process.env.PGUSER,
    process.env.PGPASSWORD,
    process.env.PGHOST,
    process.env.PGPORT,
    process.env.PGDATABASE,
  );
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
  dbClient = client;
} catch (error) {
  await shutdown();
  console.error(error);
}
async function shutdown() {
  await new Promise((resolve, reject) => {
    app.close((err) => {
      if (err) reject(err);
      else resolve();
    });
  });
  await dbClient.end();
}

export { dbClient, shutdown };
