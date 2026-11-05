import { app } from "./app.js";
import { connectDB } from "./database/dbClient.js";
const PORT = process.env.PORT || 3000;
await connectDB()
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export { server };
