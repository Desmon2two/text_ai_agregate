async function getUserById(dbClient, user_id) {
    const result = await dbClient.query(`SELECT * FROM users
    WHERE user_id = $1
    `, [user_id]);
    if (!result.rows[0])
        return null;
    return result.rows[0];
}
async function getUserByEmail(dbClient, email) {
    const result = await dbClient.query(`SELECT * FROM users
    WHERE email = $1
    `, [email]);
    if (!result.rows[0])
        return null;
    return result.rows[0];
}
async function createUser(dbClient, username, email, passwordHash) {
    const result = await dbClient.query(`INSERT INTO users(username, email, password) 
    VALUES ($1, $2, $3)
    RETURNING *
    `, [username, email, passwordHash]);
    if (!result.rows[0])
        return null;
    return result.rows[0];
}
async function changeUserDisplayData(dbClient, user_id, username) {
    const result = await dbClient.query(`
  UPDATE users 
  SET username= $2,
  WHERE user_id = $1
  RETURNING *
  `, [user_id, username]);
    if (!result.rows[0])
        return null;
    return result.rows[0];
}
async function changeUserPassword(dbClient, user_id, passwordHash) {
    const result = await dbClient.query(`
  UPDATE users 
  SET password= $2,
  WHERE user_id = $1
  RETURNING *
  `, [user_id, passwordHash]);
    if (!result.rows[0])
        return null;
    return result.rows[0];
}
async function changeUserEmail(dbClient, user_id, email) {
    const result = await dbClient.query(`
  UPDATE users 
  SET email= $2,
  WHERE user_id = $1
  RETURNING *
  `, [user_id, email]);
    if (!result.rows[0])
        return null;
    return result.rows[0];
}
async function deleteUser(dbClient, user_id) {
    const result = await dbClient.query(`DELETE FROM users WHERE user_id = $1
    `, [user_id]);
    return result.rowCount;
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
