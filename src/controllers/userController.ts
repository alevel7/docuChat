import type { Request, Response, NextFunction } from "express";

import { UserService } from "../services/userService";

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

  createUser = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
      const { name, email } = request.body as { name?: string; email?: string };
      const user = await this.userService.createUser({
        name: name ?? "",
        email: email ?? "",
      });

      response.status(201).json({ data: user });
    } catch (error) {
      next(error);
    }
  };
}
