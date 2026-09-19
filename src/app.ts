import express from "express";

import { errorHandler } from "./middlewares/errorHandler";
import { notFoundHandler } from "./middlewares/notFoundHandler";
import { userRouter } from "./routes/userRoutes";
import { appEvents } from "./lib/events";
import { authRouter } from "./routes/auth.routes";
import {documentRoutes} from "./routes/document.routes";

export const app = express();

app.use(express.json());

app.get("/health", (_request, response) => {
  response.status(200).json({ status: "ok",timestamp: new Date().toISOString() });
});

app.use("/api", userRouter);
app.use("/api/auth", authRouter);
app.use('/api/v1/documents', documentRoutes);
// app.use('/api/v1/conversations', auth, conversationRoutes);

app.use(notFoundHandler);
app.use(errorHandler);
