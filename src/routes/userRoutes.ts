import { Router } from "express";

import { UserController } from "../controllers/userController";
import { validate } from "../middlewares/validate";
import { createUserSchema, updateUserSchema } from "../schemas/user.schema";
import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/authorize.middleware";
import { deleteUser } from "../services/userService";

export const userRouter = Router();

userRouter.get("/users", UserController.listUsers);
userRouter.patch("/users/:userId", validate(updateUserSchema), UserController.updateUser);
userRouter.delete('/admin/users/:userId', authenticate, authorize('enterprise'), UserController.deleteUser);
