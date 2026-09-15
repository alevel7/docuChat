import { Router } from "express";

import { UserController } from "../controllers/userController";

const userController = new UserController();

export const userRouter = Router();

userRouter.get("/users", userController.listUsers);
userRouter.post("/users", userController.createUser);
