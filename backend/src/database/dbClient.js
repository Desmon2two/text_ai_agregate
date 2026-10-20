import { dbConfigConstructor } from "./dbConfig.js";
import pg from "pg";
import fs from "fs";
async function connectDB(user, password, host, port, database) {
    const dbConfig = dbConfigConstructor(user, password, host, port, database, {
        rejectUnauthorized: true,
        ca: fs.readFileSync("./ca.pem").toString(),
    });
    const client = new pg.Client(dbConfig);
    try {
        client.connect(function (err) {
            if (err)
                throw err;
            client.query("SELECT VERSION()", [], function (err, result) {
                if (err)
                    throw err;
                console.log(result.rows[0].version);
                console.log("Connected to the database");
            });
        });
    }
    catch (error) {
        throw error;
    }
    return client;
}
export { connectDB };
//# sourceMappingURL=dbClient.js.map