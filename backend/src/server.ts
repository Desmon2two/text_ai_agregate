import { app } from "./app.js";
import { setupDB, disconnectDB } from "./database/dbClient.js";
const PORT = process.env.PORT || 3000;
const dbClient = await setupDB()
await disconnectDB(dbClient)
const server = app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});

export { server };
