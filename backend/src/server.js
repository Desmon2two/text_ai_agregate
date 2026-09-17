import dotenv from "dotenv";
import cors from "cors"
import express from "express";
import cookieParser from "cookie-parser"
const app = express();
dotenv.config({ path: ".env", debug: true });
const PORT = process.env.PORT || 3000;
import connectDatabase from "./database/connectDatabase.js";
import authRoute from "./authFeature/authRouter.js";
import videoRoute from "./videoFeature/videoRouter.js";
import errorHandler from "./middlewears/errorMiddleware.js";

// MIDDLEWARE
app.use(express.json());
app.use(
	cors({
		origin: process.env.ALLOWED_URL,
		credentials: true,
	}),
);
app.use(cookieParser())

// MOUNTING ROUTERS
app.use("/auth", authRoute);
app.use("/videos", videoRoute);

app.get("/", (req, res) => {
	res.send("Everything works, right?");
});

// ERROR HANDLER
app.use(errorHandler);

// DATABASE THEN SERVER START
connectDatabase()
	.then(() => {
		app.listen(PORT, () => {
			console.log(`Server is running on port ${PORT}`);
		});
	})
	.catch((error) => console.error(error));
