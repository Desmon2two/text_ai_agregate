import type { Client } from "pg";
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
async function getUserByEmail(
  dbClient: Client,
  email: string,
): Promise<User | null> {
  const result = await dbClient.query(
    `SELECT * FROM users
    WHERE email = $1
    `,
    [email],
  );
  if (!result.rows[0]) return null;
  return result.rows[0];
}
async function createUser(
  dbClient: Client,
  username: string,
  email: string,
  passwordHash: string,
): Promise<User | null> {
  const result = await dbClient.query(
    `INSERT INTO users(username, email, password) 
    VALUES ($1, $2, $3)
    RETURNING *
    `,
    [username, email, passwordHash],
  );
  if (!result.rows[0]) return null;
  return result.rows[0];
}
async function changeUserDisplayData(
  dbClient: Client,
  user_id: string,
  username: string,
) {
  const result = await dbClient.query(
    `
  UPDATE users 
  SET username= $2,
  WHERE user_id = $1
  `,
    [user_id, username],
  );
  if (!result.rows[0]) return null;
  return result.rows[0];
}
async function changeUserPassword(
  dbClient: Client,
  user_id: string,
  passwordHash: string,
) {
  const result = await dbClient.query(
    `
  UPDATE users 
  SET password= $2,
  WHERE user_id = $1
  `,
    [user_id, passwordHash],
  );
  if (!result.rows[0]) return null;
  return result.rows[0];
}
async function changeUserEmail(
  dbClient: Client,
  user_id: string,
  email: string,
) {
  const result = await dbClient.query(
    `
  UPDATE users 
  SET email= $2,
  WHERE user_id = $1
  `,
    [user_id, email],
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

export default {
  getUserById,
  getUserByEmail,
  createUser,
  changeUserDisplayData,
  changeUserPassword,
  changeUserEmail,
  deleteUser,
};
