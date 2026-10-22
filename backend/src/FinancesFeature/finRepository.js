async function getCostOfModel(dbClient, model) {
    const result = await dbClient.query(`SELECT * FROM models WHERE model = $1`, [
        model,
    ]);
    return result.rows[0];
}
async function getCreditsOfUser(dbClient, user_id) {
    const result = await dbClient.query(`SELECT credits FROM users WHERE user_id = $1`, [user_id]);
    return result.rows[0];
}
async function addCredits(dbClient, user_id, amount) {
    const result = await dbClient.query(`
    UPDATE users
    SET credits = credits + $2
    WHERE user_id = $1
    RETURNING credits
    `, [user_id, amount]);
    return result.rows[0];
}
async function deductCredits(dbClient, user_id, amount) {
    const result = await dbClient.query(`
    UPDATE users
    SET credits = credits - $2
    WHERE user_id = $1
    RETURNING credits
    `, [user_id, amount]);
    return result.rows[0];
}
export default {
    getCostOfModel,
    getCreditsOfUser,
    addCredits,
    deductCredits,
};
