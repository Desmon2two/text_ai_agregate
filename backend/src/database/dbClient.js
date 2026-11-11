import sqlite from "node:sqlite";
import createRequiredTables from "../database/dbTables.js";
import path from "node:path";
export const testClient = {
    connection: null,
    getConnection() {
        return this.connection;
    },
    setConnection(connection) {
        this.connection = connection;
    },
};
async function setupDB() {
    let dbClient;
    const prodDbPath = path.resolve('src', 'database', 'DB.sqlite');
    const devDbPath = path.resolve('tests', 'helpers', 'testDB.sqlite');
    if (process.env.NODE_ENV === 'production') {
        dbClient = new sqlite.DatabaseSync(prodDbPath);
    }
    else {
        dbClient = new sqlite.DatabaseSync(devDbPath);
    }
    console.log(dbClient.prepare('SELECT sqlite_version() AS version').run());
    await createRequiredTables(dbClient);
    console.log("Database connected");
    testClient.setConnection(dbClient);
    return dbClient;
}
async function disconnectDB(dbClient) {
    await dbClient.close();
    console.log("Connection to DB closed");
}
export async function dbTemplateDelete(dbClient, table, column, selector) {
    console.log("Table, column, and selector: ", table, column, selector);
    const result = await dbClient.prepare(`
	DELETE FROM ${table}
	WHERE ${column} = ${selector}`)
        .run();
    if (result.changes === 0)
        return 1;
    return 0;
}
export async function dbTemplateInsert(dbClient, table, columns, args) {
    const placeholders = args.map(() => '?').join(", ");
    //	const columnList = columns.join(", ")
    const call = `INSERT INTO ${table} (${columns})
VALUES
(${placeholders})
RETURNING *
	`;
    const result = await dbClient.prepare(call).get(...args);
    if (!result)
        return 1;
    return result;
}
//async function dbTemplateUpdate(dbClient) { }
//async function dbTemplateSelect(dbClient) { }
export { setupDB, disconnectDB };
