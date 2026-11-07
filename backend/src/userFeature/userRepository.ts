import type { User } from "./types/userType.js";
async function getUserById(
  dbClient: Client,
  user_id: string,
): Promise<User | null> {
  const link = await dbClient.prepare(
    `SELECT * FROM users
    WHERE user_id = ?
    ;`)
  link.run(1, user_id)
  link.close();
if (!link.rows[0]) return null;
  return link.rows[0];
}
async function getUserByEmail(
  dbClient: Client,
  email: string,
): Promise<User | null> {
  const link = await dbClient.prepare(
    `SELECT * FROM users
    WHERE email = ?
    ;`)
  link.run(1, email)
  link.close();
if (!link.rows[0]) return null;
  return link.rows[0];
}
async function createUser(
  dbClient: Client,
  username: string,
  email: string,
  passwordHash: string,
): Promise<User | null> {
  const link = await dbClient.prepare(
    `INSERT INTO users(username, email, password) 
    VALUES (?, ?, ?)
    RETURNING *
    ;`)
  link.run(1, username)
  link.run(2, email)
link.run(3, passwordHash)
  link.close();
if (!link.rows[0]) return null;
  return link.rows[0];
}
async function changeUserDisplayData(
  dbClient: Client,
  user_id: string,
  username: string,
): Promise<User | null> {
  const link = await dbClient.prepare(
    `
  UPDATE users 
  SET username= ?,
  WHERE user_id = ?
  RETURNING *
  ;`)
link.run(1, user_id)
link.run(2, username)
  link.close();
if (!link.rows[0]) return null;
  return link.rows[0];
}
async function changeUserPassword(
  dbClient: Client,
  user_id: string,
  passwordHash: string,
): Promise<User | null> {
  const link = await dbClient.prepare(
    `
  UPDATE users 
  SET password= ?,
  WHERE user_id = ?
  RETURNING *
  ;`)
link.run(1, user_id)
link.run(2, passwordHash)
  link.close();
if (!link.rows[0]) return null;
  return link.rows[0];
}
async function changeUserEmail(
  dbClient: Client,
  user_id: string,
  email: string,
): Promise<User | null> {
  const link = await dbClient.prepare(
    `
  UPDATE users 
  SET email= ?,
  WHERE user_id = ?
  RETURNING *
  ;`)
link.run(1, user_id)
link.run(2, email)
  link.close();
if (!link.rows[0]) return null;
  return link.rows[0];
}
async function deleteUser(dbClient: Client, user_id: string): Promise<0 | 1> {
  const link = await dbClient.prepare(
    `DELETE FROM users WHERE user_id = ?
    ;`)
  link.run(1, user_id)
  return link.rowCount;
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
