import { Request, Response, NextFunction } from 'express';
import { getUserPermissions } from '../services/rbac.service';
import { CustomException } from './errorHandler';
import { StatusCodes } from 'http-status-codes';

export function authorize(...allowedRoles: string[]) {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Not authenticated' });
        }
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Insufficient permissions' });
        }
        next();
    };
}

export function requirePermission(...requiredPermissions: string[]) {

    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.user) {
                throw new CustomException('Not authenticated', StatusCodes.UNAUTHORIZED);
            }

            const userPermissions = await getUserPermissions(req.user.id);

            // Check that the user has ALL required permissions

            const missing = requiredPermissions.filter(
                p => !userPermissions.has(p)
            );

            if (missing.length > 0) {
                throw new CustomException(
                    `You do not have the required permission.`,
                    StatusCodes.FORBIDDEN
                );
            }

            next();
        } catch (error) {
            next(error);
        }
    };
}
