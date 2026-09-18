import { z } from 'zod';
import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from 'http-status-codes';

export const validate = (schema:any) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Parse and validate the parts of the request defined in the schema
        const parsed = await schema.parseAsync({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        // Assign the validated and typed data back to the request object
        req.body = parsed.body;
        // req.query = parsed?.query;
        // req.params = parsed?.params;

        next();
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: 'fail',
                // errors: error.issues.map(err => ({
                //     path: err.path.join('.'),
                //     message: err.message
                // }))
                errors: error.issues
            });
        }
        next(error);
    }
};