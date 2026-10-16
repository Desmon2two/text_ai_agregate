function dbConfigConstructor(
  user: string,
  password: string,
  host: string,
  port: number,
  database: string,
  ssl: { rejectUnauthorized: boolean; ca: string },
) {
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
