import type { Request, Response, NextFunction } from "express";
import { LoginUserBodyType } from "../validators/user.validator";
import { LoginResponse } from "../models/auth.models";
import AuthService, { logout } from "../services/auth.service";
import UserService from "../services/userService";

export const AuthController  = {

    registerUser: async (request: Request, response: Response, next: NextFunction): Promise<void> => {
        try {
            const users = await AuthService.registerUser(request.body);
            response.status(200).json({ data: users });
        } catch (error) {
            next(error);
        }
    },

    loginUser: async (request: Request, response: Response, next: NextFunction): Promise<void> => {
        try {
            const { email, password } = request.body as LoginUserBodyType;

            const loginDetails = await AuthService.login({
                email: email ?? "",
                password: password ?? "",
            });

            response.status(201).json({ data: loginDetails });
        } catch (error) {
            next(error);
        }
    },

    refreshToken: async (request: Request, response: Response, next: NextFunction): Promise<void> => {
        try {
            const { refreshToken } = request.body;
            const tokens = await AuthService.refresh(refreshToken);
            response.status(200).json({ data: tokens });
        } catch (error) {
            next(error);
        }
    },

    logout: async (request: Request, response: Response, next: NextFunction): Promise<void> => {
        try {
            const { refreshToken } = request.body;
            await AuthService.logout(refreshToken);
            response.status(200).json({ message: "Logged out successfully" });
        } catch (error) {
            next(error);
        }
    }
}
