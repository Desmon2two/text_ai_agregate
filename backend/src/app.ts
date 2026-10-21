import express from "express";

const app = express();

app.use(express.json());

// Mount routers here
// app.use("/users", userRouter);

// Add error handler here

export { app };
