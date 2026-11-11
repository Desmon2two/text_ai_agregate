import sqlite from "node:sqlite"
import createRequiredTables from "../database/dbTables.js";
import path from "node:path"
export const testClient = {
	connection: null,

	getConnection() {
		return this.connection
	},
	setConnection(connection) {
		this.connection = connection
	},
}
async function setupDB(
) {
	let dbClient
	const prodDbPath = path.resolve('src', 'database', 'DB.sqlite')
	const devDbPath = path.resolve('tests', 'helpers', 'testDB.sqlite')
	if (process.env.NODE_ENV === 'production') {
		dbClient = new sqlite.DatabaseSync(prodDbPath)
	} else {
		dbClient = new sqlite.DatabaseSync(devDbPath);
	}
	console.log(dbClient.prepare('SELECT sqlite_version() AS version').run());
	await createRequiredTables(dbClient)
	console.log("Database connected")
	testClient.setConnection(dbClient)
	return dbClient
}
async function disconnectDB(dbClient) {
	await dbClient.close()
	console.log("Connection to DB closed")
}
export async function dbTemplateDelete(dbClient, table, column, selector) {
	const result = await dbClient.prepare(`
	DELETE FROM ${table}
	WHERE ${column} = ${selector}`)
		.run()
	if (result.changes === 0) return 1
	return 0
}
export async function dbTemplateInsert(dbClient, table: string, columns: string[], args: any[]): Promise<0 | 1> {
	const placeholders = args.map(() => '?').join(", ")
	const call = `INSERT INTO ${table} (${columns})
VALUES
(${placeholders})
	`
	const result = await dbClient.prepare(call).get(...args)
	if (!result) return 1
	return 0
}
export async function dbTemplateUpdate(dbClient, table: string, columns: string[], args: string[] | number[]): Promise<0 | 1> {
	//So i have a few options - i can try and make this function extremely flexible, or i can make 3 verions of it for different needs. I skimmed through the project - generally it's about 3 variations. Maybe if i think a bit more i can boil it down even more.'
	const placeholders = args.map((item) => `'${item} = ?'`).join(", ")
	const call = `UPDATE TABLE ${table} SET (${placeholders}, updated_at = datetime('now'))
	WHERE ${identifier}
	AND ${secondIdentifier}
	`
	const result = await dbClient.prepare(call).get(...args)
	if (!result) return 1
	return 0
}
export async function dbTemplateSelect(dbClient, table: string, column: string, selector: number | string): Promise<T | 1> {
	const result = await dbClient.prepare(`
	SELECT * FROM ${table}
	WHERE ${column} = ?`)
		.get(selector)
	if (!result) return 1
	return result
}
export { setupDB, disconnectDB };
