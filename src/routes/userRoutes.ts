import { Router } from "express";

import { UserController } from "../controllers/userController";
import { validate } from "../middlewares/validate";
import { createUserSchema, updateUserSchema } from "../schemas/user.schema";

const userController = new UserController();

export const userRouter = Router();

userRouter.get("/users", userController.listUsers);
userRouter.patch("/users/:userId", validate(updateUserSchema), userController.updateUser);
