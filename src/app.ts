import express from "express";

import { errorHandler } from "./middlewares/errorHandler";
import { notFoundHandler } from "./middlewares/notFoundHandler";
import { userRouter } from "./routes/userRoutes";
import { appEvents } from "./lib/events";

export const app = express();

app.use(express.json());

app.get("/health", (_request, response) => {
  response.status(200).json({ status: "ok" });
});

app.use("/api", userRouter);
app.use(notFoundHandler);
app.use(errorHandler);
