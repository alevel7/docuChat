import { z } from 'zod';

export const updateUserSchema = z.object({
    body: z.object({
        firstName: z.string().min(1, "First name must be at least 1 characters").optional(),
        lastName: z.string().min(1, "Last name must be at least 1 characters").optional(),
    }),
    params: z.object({
        userId: z.string('Invalid user id')
    }),
});


export type UpdateUserBodyType = z.infer<typeof updateUserSchema>['body'];