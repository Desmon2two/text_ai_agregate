import express from "express";
const app = express();
app.use(express.json());
// app.use("/users", userRouter);
// Add error handler here
export { app };
