import express from "express";
const app = express();
app.use(express.json());
// Mount routers here
// and do something else
// app.use("/users", userRouter);
// Add error handler here
export { app };
