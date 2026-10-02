import dbConfig from "./dbConfig";

const fs = require("fs");
const pg = require("pg");
const url = require("url");



export const dbClient = new pg.Client(dbConfig);
