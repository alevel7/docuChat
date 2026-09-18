import { Router } from "express";

import { UserController } from "../controllers/userController";
import { validate } from "../middlewares/validate";
import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/authorize.middleware";
import { updateUserSchema } from "../validators/user.validator";

export const userRouter = Router();

userRouter.get("/users", UserController.listUsers);
userRouter.patch("/users/:userId", validate(updateUserSchema), UserController.updateUser);
userRouter.delete('/admin/users/:userId', authenticate, authorize('enterprise'), UserController.deleteUser);
