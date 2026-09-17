// src/services/auth.service.ts
import prisma from "../config/database"
import { hashPassword, verifyPassword } from '../lib/password';
import {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
} from '../lib/tokens';
import crypto from 'crypto';
import { UserService } from './userService';
import { UserCreateInput } from "../generated/prisma/models";
import { LoginResponse } from "../models/auth.models";



export class AuthService {
    constructor(private readonly userService: UserService = new UserService()) { }

    // ── Register ────────────────────────────────────────────────

    public async registerUser(data: UserCreateInput): Promise<{ id: string; email: string; tier: string }> {

        const passwordHash = await hashPassword(data.password);

        const user = await this.userService.createUser({
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            password: passwordHash,
        });

        // Don't return the hash
        return { id: user.id, email: user.email, tier: user.tier };
    }

    public async login(data: {
        email: string;
        password: string;
        deviceInfo?: string;
    }): Promise<LoginResponse> {
        const user = await this.userService.getUserByEmail(data.email);

        // Same error for "user not found" and "wrong password"
        // This prevents user enumeration attacks
        if (!user || !user.isActive) {
            throw new Error('Invalid credentials');
        }

        const valid = await verifyPassword(data.password, user.passwordHash);
        if (!valid) {
            throw new Error('Invalid credentials');
        }

        // Generate tokens
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        // Store the refresh token hash (never store the raw token)
        const tokenHash = crypto
            .createHash('sha256')
            .update(refreshToken)
            .digest('hex');

        // We need a RefreshToken model for this.
        // Add it to your schema if you haven't already.
        await prisma.refreshToken.create({
            data: {
                userId: user.id,
                token: tokenHash,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
        });

        return {
            accessToken,
            refreshToken,
            user: { id: user.id, email: user.email, tier: user.tier },
        };
    }
}