import { z } from 'zod';

export const createUserSchema = z.object({
    body: z.object({
        firstName: z.string().min(1, "First name must be at least 1 characters"),
        lastName: z.string().min(1, "Last name must be at least 1 characters"),
        email: z.string().email("Invalid email address"),
        //password should be alphanumeric and at least 6 characters long
        password: z.string().min(6, "Password must be at least 6 characters").refine((val) => /^(?=.*[a-zA-Z])(?=.*[0-9])/.test(val), {
            message: "Password must contain at least one letter and one number",
        }),
    }),
});

export type UserBodyType = z.infer<typeof createUserSchema>['body'];


export const updateUserSchema = z.object({
    body: z.object({
        firstName: z.string().min(1, "First name must be at least 1 characters").optional(),
        lastName: z.string().min(1, "Last name must be at least 1 characters").optional(),
    }),
    params: z.object({
        userId: z.number().int("Invalid user ID format"), // Validates integer format
    }),
});


export type UpdateUserBodyType = z.infer<typeof updateUserSchema>['body'];


export const loginUserSchema = z.object({
    body: z.object({
        email: z.string().email("Invalid email address"),
        password: z.string().min(6, "Password must be at least 6 characters"),
    }),
});

export type LoginUserBodyType = z.infer<typeof loginUserSchema>['body'];