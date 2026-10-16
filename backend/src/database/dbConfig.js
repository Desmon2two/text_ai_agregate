function dbConfigConstructor(user, password, host, port, database, ssl) {
    return {
        user,
        password,
        host,
        port,
        database,
        ssl: { rejectUnauthorized: ssl.rejectUnauthorized, ca: ssl.ca },
    };
}
export { dbConfigConstructor };
//# sourceMappingURL=dbConfig.js.map