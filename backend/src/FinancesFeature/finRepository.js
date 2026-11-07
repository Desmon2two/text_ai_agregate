import { FinLog } from "./types/FinLogType";
async function getCostOfModel(dbClient, model) {
    const link = await dbClient.prepare(`
    SELECT * FROM models 
    WHERE model = ? 
    ;`);
    link.run(1, model);
    link.close();
    if (!link.rows[0])
        return null;
    return link.rows[0];
    ;
}
async function getCreditsOfUser(dbClient, user_id) {
    const link = await dbClient.prepare(`SELECT credits FROM users WHERE user_id = ?
	;`);
    link.run(1, user_id);
    link.close();
    return link;
}
async function getCreditLogOfUser(dbClient, user_id) {
    const link = await dbClient.prepare(`SELECT * FROM fin_logs 
    WHERE user_id = ?
    SORT DESC
    ;`);
    link.run(1, user_id);
    link.close();
    if (!link.rows[0])
        return null;
    return link.rows[0];
}
async function createFinLog(dbClient, user_id, amount, reason) {
    const link = await dbClient.prepare(`INSERT INTO fin_logs (amount, reason)
    VALUES ($2, $3)
    WHERE user_id = $1
    RETURNING *
    ;`);
    link.run(1, user_id);
    link.run(2, amount);
    link.run(3, JSON.stringify(reason));
    link.close();
    if (!link.rows[0])
        return null;
    return link.rows[0];
    ;
}
async function addCredits(dbClient, user_id, amount) {
    const link = await dbClient.prepare(`
    UPDATE users
    SET credits = credits + ?
    WHERE user_id = ?
    RETURNING credits
    ;`);
    link.run(1, user_id);
    link.run(2, amount);
    link.close();
    return link;
}
async function deductCredits(dbClient, user_id, amount) {
    await dbClient.prepare(`UPDATE users
		SET credits = credits - ? 
		WHERE user_id = ? 
		RETURNING credits;`)
        .run(user_id, amount);
}
export default {
    getCostOfModel,
    getCreditsOfUser,
    getCreditLogOfUser,
    createFinLog: createFinLog,
    addCredits,
    deductCredits,
};
