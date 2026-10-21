import { Client } from "pg";
import type { User } from "./types/userType.js";

async function createUser(
  dbClient: Client,
  email: string,
  password: string,
): Promise<User | null> {
  const result = await dbClient.query(
    `INSERT INTO users(email, password) 
    VALUES ($1, $2)
    RETURNING *
    `,
    [email, password],
  );
  return result.rows[0];
}

export { createUser };
