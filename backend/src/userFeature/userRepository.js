async function getUserById(dbClient, user_id) {
    const link = await dbClient.prepare(`SELECT * FROM users
    WHERE user_id = ?
    ;`);
    link.run(1, user_id);
    link.close();
    if (!result.rows[0])
        return null;
    return result.rows[0];
}
async function getUserByEmail(dbClient, email) {
    const link = await dbClient.prepare(`SELECT * FROM users
    WHERE email = ?
    ;`);
    link.run(1, email);
    link.close();
    if (!result.rows[0])
        return null;
    return result.rows[0];
}
async function createUser(dbClient, username, email, passwordHash) {
    const link = await dbClient.prepare(`INSERT INTO users(username, email, password) 
    VALUES (?, ?, ?)
    RETURNING *
    ;`);
    link.run(1, username);
    link.run(2, email);
    link.run(3, passwordHash);
    link.close();
    if (!result.rows[0])
        return null;
    return result.rows[0];
}
async function changeUserDisplayData(dbClient, user_id, username) {
    const link = await dbClient.prepare(`
  UPDATE users 
  SET username= ?,
  WHERE user_id = ?
  RETURNING *
  ;`);
    link.run(1, user_id);
    link.run(2, username);
    link.close();
    if (!result.rows[0])
        return null;
    return result.rows[0];
}
async function changeUserPassword(dbClient, user_id, passwordHash) {
    const link = await dbClient.prepare(`
  UPDATE users 
  SET password= ?,
  WHERE user_id = ?
  RETURNING *
  ;`);
    link.run(1, user_id);
    link.run(2, passwordHash);
    link.close();
    if (!result.rows[0])
        return null;
    return result.rows[0];
}
async function changeUserEmail(dbClient, user_id, email) {
    const link = await dbClient.prepare(`
  UPDATE users 
  SET email= ?,
  WHERE user_id = ?
  RETURNING *
  ;`);
    link.run(1, user_id);
    link.run(2, email);
    link.close();
    if (!result.rows[0])
        return null;
    return result.rows[0];
}
async function deleteUser(dbClient, user_id) {
    const link = await dbClient.prepare(`DELETE FROM users WHERE user_id = ?
    ;`);
    link.run(1, user_id);
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
