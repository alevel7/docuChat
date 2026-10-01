import express from "express";

import { errorHandler } from "./middlewares/errorHandler";
import { notFoundHandler } from "./middlewares/notFoundHandler";
import { userRouter } from "./routes/userRoutes";
import { bullBoardAdapter } from './config/bull-board';

import './events/admin.events';
import './events/auth.events';
import './events/document.events';
import './queues/document.worker';
import './events/cache.events';

import { authRouter } from "./routes/auth.routes";
import {documentRoutes} from "./routes/document.routes";
import adminRouter from "./routes/admin";
import { verifyWebhookSignature } from "./middlewares/verifyWebhook";
import { apiLimiter, authLimiter, chatLimiter, uploadLimiter } from "./middlewares/rateLimiter.middleware";


const secret = process.env.WEBHOOK_SECRET as string;

export const app = express();

app.use(express.json());

app.get("/health", (_request, response) => {
  response.status(200).json({ status: "ok",timestamp: new Date().toISOString() });
});

app.use('/webhooks', verifyWebhookSignature(secret, "x-signature"), 
express.raw({ 
  type: 'application/json' ,
  verify: (req: any, res, buf) => {
    req.rawBody = buf;
  },

}));

app.use("/api", apiLimiter, userRouter);
app.use("/api/auth", authLimiter, authRouter);
app.use('/api/v1/documents', uploadLimiter, documentRoutes);
app.use('/api/v1/admin', adminRouter);
app.use('/admin/queues', bullBoardAdapter.getRouter());
// app.use('/api/v1/conversations', auth, chatLimiter, conversationRoutes);

app.use(notFoundHandler);
app.use(errorHandler);
