import type { Request, Response, NextFunction } from "express";

import { UserService } from "../services/userService";
import { UpdateUserBodyType } from "../schemas/user.schema";

export class UserController {
  constructor(private readonly userService: UserService = new UserService()) {}

  listUsers = async (_request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
      const users = await this.userService.listUsers();
      response.status(200).json({ data: users });
    } catch (error) {
      next(error);
    }
  };

  updateUser = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = Number(request.params.userId);
      const { firstName, lastName } = request.body as UpdateUserBodyType;
      const user = await this.userService.updateUser(userId, {
        firstName: firstName ?? "",
        lastName: lastName ?? "",
      });

      response.status(201).json({ data: user });
    } catch (error) {
      next(error);
    }
  };
}
