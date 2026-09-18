import { Router } from "express";

import { UserController } from "../controllers/userController";
import { validate } from "../middlewares/validate";
import { createUserSchema, loginUserSchema } from "../schemas/user.schema";
import { AuthController } from "../controllers/authController";


export const authRouter = Router();

authRouter.post("/register", validate(createUserSchema), AuthController.registerUser);
authRouter.post("/login", validate(loginUserSchema), AuthController.loginUser);
authRouter.post("/refresh", validate(loginUserSchema), AuthController.refreshToken);
authRouter.post("/logout", validate(loginUserSchema), AuthController.logout);
