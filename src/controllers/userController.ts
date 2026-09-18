import type { Request, Response, NextFunction } from "express";
import { UpdateUserBodyType } from "../validators/user.validator";
import UserService from "../services/userService";

export const UserController  = {
  listUsers: async (_request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
      const users = await UserService.listUsers();
      response.status(200).json({ data: users });
    } catch (error) {
      next(error);
    }
  },

  updateUser: async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = String(request.params.userId);
      const { firstName, lastName } = request.body as UpdateUserBodyType;
      const user = await UserService.updateUser(userId, {
        firstName: firstName ?? "",
        lastName: lastName ?? "",
      });

      response.status(201).json({ data: user });
    } catch (error) {
      next(error);
    }
  },

  deleteUser: async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = String(request.params.userId);
      await UserService.deleteUser(userId);
      response.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
