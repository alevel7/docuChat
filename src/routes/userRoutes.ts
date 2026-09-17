import { Router } from "express";

import { UserController } from "../controllers/userController";
import { validate } from "../middlewares/validate";
import { createUserSchema } from "../schemas/user.schema";

const userController = new UserController();

export const userRouter = Router();

userRouter.get("/users", userController.listUsers);
userRouter.post("/users", validate(createUserSchema), userController.createUser);
