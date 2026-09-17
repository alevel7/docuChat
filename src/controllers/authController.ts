import type { Request, Response, NextFunction } from "express";

import { UserService } from "../services/userService";
import { AuthService } from "../services/auth.service";
import { LoginUserBodyType } from "../schemas/user.schema";
import { LoginResponse } from "../models/auth.models";

export class AuthController {
    constructor(
        private readonly userService: UserService = new UserService(),
        private readonly authService: AuthService = new AuthService(),
    ) { }

    async registerUser(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const users = await this.authService.registerUser(request.body);
            response.status(200).json({ data: users });
        } catch (error) {
            next(error);
        }
    };

    async loginUser(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const { email, password } = request.body as LoginUserBodyType;

            const loginDetails = await this.authService.login({
                email: email ?? "",
                password: password ?? "",
            });

            response.status(201).json({ data: loginDetails });
        } catch (error) {
            next(error);
        }
    };
}
