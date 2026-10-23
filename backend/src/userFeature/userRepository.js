import { Client } from "pg";
async function getUserById(dbClient, user_id) {
    const result = await dbClient.query(`SELECT * FROM users
    WHERE user_id = $1
    `, [user_id]);
    if (!result.rows[0])
        return null;
    return result.rows[0];
}
async function createUser(dbClient, email, password) {
    const result = await dbClient.query(`INSERT INTO users(email, password) 
    VALUES ($1, $2)
    RETURNING *
    `, [email, password]);
    if (!result.rows[0])
        return null;
    return result.rows[0];
}
async function deleteUser(dbClient, userId) {
    const result = await dbClient.query(`DELETE FROM users WHERE user_id = $1
    `, [userId]);
    if (!result)
        return null;
    return result;
}
export default { getUserById, createUser, deleteUser };
