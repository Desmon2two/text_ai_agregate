import dbConfig from "./dbConfig";

const fs = require("fs");
const pg = require("pg");
const url = require("url");



export const dbClient = new pg.Client(dbConfig);
async function connectDB(dbClient){
    try {
        await dbClient.connect();
        console.log("Connected to the database");
        
    } catch (error) {
        throw new Error("Failed to connect to the database");
    }
};
export default {dbClient, connectDB}
