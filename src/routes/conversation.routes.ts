import { Router } from "express";
import { conditionalGet } from "../middlewares/etag";
import { authenticate } from "../middlewares/auth.middleware";
import { listConversations } from "../services/conversation.service";


export const conversationRoutes = Router();
conversationRoutes.use(authenticate); // All conversation routes require auth

// conversationRoutes.get('/conversations', conditionalGet(), listConversations);