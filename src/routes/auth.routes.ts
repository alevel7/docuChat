import { Router } from "express";

import { validate } from "../middlewares/validate";
import { AuthController } from "../controllers/authController";
import { createUserSchema, loginUserSchema } from "../validators/auth.validator";


export const authRouter = Router();

authRouter.post("/register", validate(createUserSchema), AuthController.registerUser);
authRouter.post("/login", validate(loginUserSchema), AuthController.loginUser);
authRouter.post("/refresh", validate(loginUserSchema), AuthController.refreshToken);
authRouter.post("/logout", validate(loginUserSchema), AuthController.logout);
