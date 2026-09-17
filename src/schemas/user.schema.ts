import { z } from 'zod';

export const createUserSchema = z.object({
    body: z.object({
        username: z.string().min(3, "Username must be at least 3 characters"),
        email: z.string().email("Invalid email address"),
        age: z.number().int().positive().optional(),
    }),
});