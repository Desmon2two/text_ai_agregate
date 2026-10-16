declare function dbConfigConstructor(user: string, password: string, host: string, port: number, database: string, ssl: {
    rejectUnauthorized: boolean;
    ca: string;
}): {
    user: string;
    password: string;
    host: string;
    port: number;
    database: string;
    ssl: {
        rejectUnauthorized: boolean;
        ca: string;
    };
};
export { dbConfigConstructor };
//# sourceMappingURL=dbConfig.d.ts.map