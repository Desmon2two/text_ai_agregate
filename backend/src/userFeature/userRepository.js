async function getUserById(dbClient, user_id) {
    const link = await dbClient.prepare(`SELECT * FROM users
    WHERE user_id = ?1
    ;`).get(user_id);
    if (!link)
        return null;
    return link;
}
async function getUserByEmail(dbClient, email) {
    const link = await dbClient.prepare(`SELECT * FROM users
    WHERE email = ?1
    ;`).get(email);
    if (!link)
        return null;
    return link;
}
async function createUser(dbClient, username, email, passwordHash) {
    const link = await dbClient.prepare(`INSERT INTO users(username, email, password) 
    VALUES (?1, ?2, ?3)
    RETURNING *
    ;`).get(username, email, passwordHash);
    if (!link)
        return null;
    return link;
}
async function changeUserDisplayData(dbClient, user_id, username) {
    const link = await dbClient.prepare(`UPDATE users 
  SET username= ?1,
  WHERE user_id = ?2
  RETURNING *
  ;`).get(username, user_id);
    if (!link)
        return null;
    return link;
}
async function changeUserPassword(dbClient, user_id, passwordHash) {
    const link = await dbClient.prepare(`
  UPDATE users 
  SET password= ?1,
  WHERE user_id = ?2
  RETURNING *
  ;`).get(passwordHash, user_id);
    if (!link)
        return null;
    return link;
}
async function changeUserEmail(dbClient, user_id, email) {
    const link = await dbClient.prepare(`
  UPDATE users 
  SET email= ?1,
  WHERE user_id = ?2
  RETURNING *
  ;`).get(email, user_id);
    if (!link)
        return null;
    return link;
}
async function deleteUser(dbClient, user_id) {
    const link = await dbClient.prepare(`DELETE FROM users WHERE user_id = ?1
    ;`).get(user_id);
    if (link.changes === 0)
        return 1;
    return 0;
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
