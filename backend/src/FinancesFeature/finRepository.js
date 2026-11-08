async function getCostOfModel(dbClient, model) {
    const link = await dbClient.prepare(`
    SELECT * FROM models 
    WHERE model = ? 
    ;`).get(model);
    if (!link)
        return null;
    return link;
}
async function getCreditsOfUser(dbClient, user_id) {
    const link = await dbClient.prepare(`SELECT credits FROM users WHERE user_id = ?
	;`).get(user_id);
    if (!link)
        return null;
    return link;
}
async function getCreditLogOfUser(dbClient, user_id) {
    const link = await dbClient.prepare(`SELECT * FROM fin_logs 
    WHERE user_id = ?
    SORT DESC
    ;`).get(user_id);
    if (!link)
        return null;
    return link;
}
async function createFinLog(dbClient, user_id, amount, reason) {
    const link = await dbClient.prepare(`INSERT INTO fin_logs (amount, reason)
    VALUES ($2, $3)
    WHERE user_id = $1
    RETURNING *
    ;`).get(user_id, amount, JSON.stringify(reason));
    if (!link)
        return null;
    return link;
}
async function addCredits(dbClient, user_id, amount) {
    const link = await dbClient.prepare(`
    UPDATE users
    SET credits = credits + ?2
    WHERE user_id = ?1
    RETURNING credits
    ;`).get(user_id, amount);
    if (!link)
        return null;
    return link.credits;
}
async function deductCredits(dbClient, user_id, amount) {
    const credits = await dbClient.prepare(`UPDATE users
		SET credits = credits - ?2
		WHERE user_id = ?1 
		RETURNING credits;`)
        .get(user_id, amount);
    if (!credits)
        return null;
    return credits;
}
export default {
    getCostOfModel,
    getCreditsOfUser,
    getCreditLogOfUser,
    createFinLog: createFinLog,
    addCredits,
    deductCredits,
};
