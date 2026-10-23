import { Client } from "pg";
import type { User } from "./types/userType.js";
import type { PostgreSQLResponse } from "../database/types/databaseResultTypes.js";
async function getUserById(
  dbClient: Client,
  user_id: string,
): Promise<User | null> {
  const result = await dbClient.query(
    `SELECT * FROM users
    WHERE user_id = $1
    `,
    [user_id],
  );
  if (!result.rows[0]) return null;
  return result.rows[0];
}
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
  if (!result.rows[0]) return null;
  return result.rows[0];
}
async function deleteUser(
  dbClient: Client,
  userId: string,
): Promise<PostgreSQLResponse | null> {
  const result = await dbClient.query(
    `DELETE FROM users WHERE user_id = $1
    `,
    [userId],
  );
  if (!result) return null;
  return result;
}

export default { getUserById, createUser, deleteUser };
