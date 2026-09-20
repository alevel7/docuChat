import type { Request, Response, NextFunction } from "express";
import { LoginResponse } from "../models/auth.models";
import AuthService, { logout } from "../services/auth.service";
import { LoginUserBodyType } from "../validators/auth.validator";
import { StatusCodes } from "http-status-codes";

export const AuthController  = {

    registerUser: async (request: Request, response: Response, next: NextFunction): Promise<void> => {
        try {
            const users = await AuthService.registerUser(request.body);
            response.status(StatusCodes.CREATED).json({ data: users });
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

            response.status(StatusCodes.OK).json({ data: loginDetails });
        } catch (error) {
            next(error);
        }
    },

    refreshToken: async (request: Request, response: Response, next: NextFunction): Promise<void> => {
        try {
            const { refreshToken } = request.body;
            const tokens = await AuthService.refresh(refreshToken);
            response.status(StatusCodes.OK).json({ data: tokens });
        } catch (error) {
            next(error);
        }
    },

    logout: async (request: Request, response: Response, next: NextFunction): Promise<void> => {
        try {
            const { refreshToken } = request.body;
            await AuthService.logout(refreshToken);
            response.status(StatusCodes.OK).json({ message: "Logged out successfully" });
        } catch (error) {
            next(error);
        }
    }
}
