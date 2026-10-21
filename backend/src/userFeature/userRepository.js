import { Client } from "pg";
async function createUser(dbClient, email, password) {
    const result = await dbClient.query(`INSERT INTO users(email, password) 
    VALUES ($1, $2)
    RETURNING *
    `, [email, password]);
    return result.rows[0];
}
async function deleteUser(dbClient, userId) {
    const result = await dbClient.query(`DELETE FROM users WHERE user_id = $1
    `, [userId]);
    return result;
}
export default { createUser, deleteUser };
