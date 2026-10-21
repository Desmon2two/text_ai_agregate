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
let shutdown;
try {
  const client = await connectDB(
    process.env.PGUSER,
    process.env.PGPASSWORD,
    process.env.PGHOST,
    process.env.PGPORT,
    process.env.PGDATABASE,
  );
  const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
  async function shutDown() {
    await new Promise((resolve, reject) => {
      server.close((err) => {
        if (err) reject(err);
        else resolve();
      });
    });
    await dbClient.end();
  }
  shutdown = shutDown;
  dbClient = client;
} catch (error) {
  await shutdown();
  console.error(error);
}

export { dbClient, shutdown };
