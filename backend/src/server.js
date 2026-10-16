import dotenv from "dotenv";
import dns from "node:dns";
dns.setDefaultResultOrder("ipv4first");

import { connectDB } from "./database/dbClient.js";
import express from "express";

const app = express();
dotenv.config({ path: ".env", debug: true });
const PORT = process.env.PORT || 3000;

// MIDDLEWARE
app.use(express.json());

// MOUNTING ROUTERS

// ERROR HANDLER

// DATABASE THEN SERVER START

const dbClient = await connectDB(
  process.env.PGUSER,
  process.env.PGPASSWORD,
  process.env.PGHOST,
  process.env.PGPORT,
  process.env.PGDATABASE,
)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => console.error(error));
