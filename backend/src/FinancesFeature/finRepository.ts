import { FinLog } from "./types/FinLogType";

async function getCostOfModel(dbClient: Client, model: string) {
	const link = await dbClient.prepare(
		`
    SELECT * FROM models 
    WHERE model = ? 
    ;`
	);
	link.run(1, model)
	link.close()
	if (!link.rows[0]) return null;
	return link.rows[0]);
}
async function getCreditsOfUser(
	dbClient: Client,
	user_id: string,
): Promise<number | null> {
	const link = await dbClient.prepare(
		`SELECT credits FROM users WHERE user_id = ?
	;`);
	link.run(1, user_id)
	link.close()
	return link
}
async function getCreditLogOfUser(
	dbClient: Client,
	user_id: string,
): Promise<FinLog[] | null> {
	const link = await dbClient.prepare(
		`SELECT * FROM fin_logs 
    WHERE user_id = ?
    SORT DESC
    ;`);
	link.run(1, user_id)
	link.close()
	if (!link.rows[0]) return null;
	return link.rows[0];
}
async function createFinLog(
	dbClient: Client,
	user_id: string,
	amount: number,
	reason: string,
): Promise<FinLog | null> {
	const link = await dbClient.prepare(
		`INSERT INTO fin_logs (amount, reason)
    VALUES ($2, $3)
    WHERE user_id = $1
    RETURNING *
    ;`);
	link.run(1, user_id)
	link.run(2, amount)
	link.run(3, JSON.stringify(reason))
	link.close()
	if (!link.rows[0]) return null;
	return link.rows[0]);
}
async function addCredits(
	dbClient: Client,
	user_id: string,
	amount: number,
): Promise<number | null> {
	const link = await dbClient.prepare(
		`
    UPDATE users
    SET credits = credits + ?
    WHERE user_id = ?
    RETURNING credits
    ;`
	);
	link.run(1, user_id)
	link.run(2, amount)
	link.close()
	return link
}
async function deductCredits(
	dbClient: Client,
	user_id: string,
	amount: number,
): Promise<void> {
	await dbClient.prepare(
		`UPDATE users
		SET credits = credits - ? 
		WHERE user_id = ? 
		RETURNING credits;`)
		.run(user_id, amount)
}
export default {
	getCostOfModel,
	getCreditsOfUser,
	getCreditLogOfUser,
	createFinLog: createFinLog,
	addCredits,
	deductCredits,
};
