import dotenv from "dotenv";
import { app } from "./app.js";
import { connectDB } from "./database/dbClient.js";
dotenv.config({ path: ".env" });
const dbClient = await connectDB(process.env.PGUSER, process.env.PGPASSWORD, process.env.PGHOST, process.env.PGPORT, process.env.PGDATABASE);
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
export { dbClient, server };
