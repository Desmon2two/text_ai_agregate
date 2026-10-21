import { Client } from "pg";
import type { User } from "./types/userType.js";
import type { PostgreSQLResponse } from "../database/types/databaseResultTypes.js";

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
async function deleteUser(
  dbClient: Client,
  userId: string,
): Promise<PostgreSQLResponse> {
  const result = await dbClient.query(
    `DELETE FROM users WHERE user_id = $1
    `,
    [userId],
  );
  return result;
}

export default { createUser, deleteUser };
