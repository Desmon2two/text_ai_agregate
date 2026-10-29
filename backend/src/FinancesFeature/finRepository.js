import { FinLog } from "./types/FinLogType";
async function getCostOfModel(dbClient, model) {
    const result = await dbClient.query(`
    SELECT * FROM models 
    WHERE model = $1
    `, [model]);
    if (!result.rows[0])
        return null;
    return result.rows[0];
}
async function getCreditsOfUser(dbClient, user_id) {
    const result = await dbClient.query(`SELECT credits FROM users WHERE user_id = $1`, [user_id]);
    return result.rows[0].credits;
}
async function getCreditLogOfUser(dbClient, user_id) {
    const result = await dbClient.query(`SELECT * FROM fin_logs 
    WHERE user_id = $1
    SORT DESC
    `, [user_id]);
    if (!result.rows)
        return null;
    return result.rows;
}
async function createFinLog(dbClient, user_id, amount, reason) {
    const result = await dbClient.query(`INSERT INTO fin_logs (amount, reason)
    VALUES ($2, $3)
    WHERE user_id = $1
    RETURNING *
    `, [user_id, amount, JSON.stringify(reason)]);
    if (!result.rows[0])
        return null;
    return result.rows[0];
}
async function addCredits(dbClient, user_id, amount) {
    const result = await dbClient.query(`
    UPDATE users
    SET credits = credits + $2
    WHERE user_id = $1
    RETURNING credits
    `, [user_id, amount]);
    if (!result.rows[0])
        return null;
    return result.rows[0].credits;
}
async function deductCredits(dbClient, user_id, amount) {
    const result = await dbClient.query(`
    UPDATE users
    SET credits = credits - $2
    WHERE user_id = $1
    RETURNING credits
    `, [user_id, amount]);
    if (!result.rows[0])
        return null;
    return result.rows[0].credits;
}
export default {
    getCostOfModel,
    getCreditsOfUser,
    getCreditLogOfUser,
    createFinLog,
    addCredits,
    deductCredits,
};
