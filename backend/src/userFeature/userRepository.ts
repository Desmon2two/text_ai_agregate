import type { User } from "./types/userType.js";
async function getUserById(
	dbClient: Client,
	user_id: string,
): Promise<User | null> {
	const link = await dbClient.prepare(
		`SELECT * FROM users
    WHERE user_id = ?1
    ;`).get(user_id)
	if (!link) return null;
	return link;
}
async function getUserByEmail(
	dbClient: Client,
	email: string,
): Promise<User | null> {
	const link = await dbClient.prepare(
		`SELECT * FROM users
    WHERE email = ?1
    ;`).get(email)
	if (!link) return null;
	return link;
}
async function createUser(
	dbClient: Client,
	username: string,
	email: string,
	passwordHash: string,
): Promise<User | null> {
	const link = await dbClient.prepare(
		`INSERT INTO users(username, email, password) 
    VALUES (?1, ?2, ?3)
    RETURNING *
    ;`).get(username, email, passwordHash)
	if (!link) return null;
	return link;
}
async function changeUserDisplayData(
	dbClient: Client,
	user_id: string,
	username: string,
): Promise<User | null> {
	const link = await dbClient.prepare(
		`UPDATE users 
  SET username= ?1,
  WHERE user_id = ?2
  RETURNING *
  ;`).get(username, user_id)
	if (!link) return null;
	return link;
}
async function changeUserPassword(
	dbClient: Client,
	user_id: string,
	passwordHash: string,
): Promise<User | null> {
	const link = await dbClient.prepare(
		`
  UPDATE users 
  SET password= ?1,
  WHERE user_id = ?2
  RETURNING *
  ;`).get(passwordHash, user_id)
	if (!link) return null;
	return link;
}
async function changeUserEmail(
	dbClient: Client,
	user_id: string,
	email: string,
): Promise<User | null> {
	const link = await dbClient.prepare(
		`
  UPDATE users 
  SET email= ?1,
  WHERE user_id = ?2
  RETURNING *
  ;`).get(email, user_id)
	if (!link) return null;
	return link;
}
async function deleteUser(dbClient: Client, user_id: string): Promise<0 | 1> {
	const link = await dbClient.prepare(
		`DELETE FROM users WHERE user_id = ?1
    ;`).get(user_id)
	if (link.changes === 0) return 1
	return 0
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
