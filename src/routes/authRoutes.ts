import { Router } from "express";

import { UserController } from "../controllers/userController";
import { validate } from "../middlewares/validate";
import { createUserSchema, loginUserSchema } from "../schemas/user.schema";
import { AuthController } from "../controllers/authController";

const authController = new AuthController();

export const userRouter = Router();

userRouter.post("/auth/register", validate(createUserSchema), authController.registerUser);
userRouter.post("/auth/login", validate(loginUserSchema), authController.loginUser);
