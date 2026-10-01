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
import { sanitizeInput } from "./middlewares/sanitize";
import helmet from 'helmet';


const secret = process.env.WEBHOOK_SECRET as string;

export const app = express();

app.use(express.json());
app.use(sanitizeInput);
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'none'"],
      scriptSrc: ["'none'"],
      styleSrc: ["'none'"],
      imgSrc: ["'none'"],
      connectSrc: ["'self'"],
      // Allow Swagger UI if you serve it
      // scriptSrc: ["'self'", "'unsafe-inline'"],
      // styleSrc: ["'self'", "'unsafe-inline'"],
    },
  },
}
));

app.use('/api-docs', helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:"],
    },
  },
}));

import cors from 'cors';

const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:3001',
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, server-to-server)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    }
  },
  credentials: true,  // Allow cookies/auth headers
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400, // Cache preflight requests for 24 hours
}));



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
