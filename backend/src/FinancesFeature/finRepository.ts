async function getCostOfModel(dbClient: Client, model: string) {
  const result = await dbClient.query(`SELECT * FROM models WHERE model = $1`, [
    model,
  ]);
  if (!result.rows[0]) return null;
  return result.rows[0];
}
async function getCreditsOfUser(
  dbClient: Client,
  user_id: string,
): Promise<number | null> {
  const result = await dbClient.query(
    `SELECT credits FROM users WHERE user_id = $1`,
    [user_id],
  );
  return result.rows[0].credits;
}
async function addCredits(
  dbClient: Client,
  user_id: string,
  amount: number,
): Promise<number | null> {
  const result = await dbClient.query(
    `
    UPDATE users
    SET credits = credits + $2
    WHERE user_id = $1
    RETURNING credits
    `,
    [user_id, amount],
  );
  return result.rows[0].credits;
}
async function deductCredits(
  dbClient: Client,
  user_id: string,
  amount: number,
): Promise<number | null> {
  const result = await dbClient.query(
    `
    UPDATE users
    SET credits = credits - $2
    WHERE user_id = $1
    RETURNING credits
    `,
    [user_id, amount],
  );
  return result.rows[0].credits;
}
export default {
  getCostOfModel,
  getCreditsOfUser,
  addCredits,
  deductCredits,
};
