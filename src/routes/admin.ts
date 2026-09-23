import { Router } from 'express';
import { appEvents } from '../lib/events';
import { authenticate } from '../middlewares/auth.middleware';
import { requirePermission } from '../middlewares/authorize.middleware';
import prisma from '../config/database';
import { CustomException } from '../middlewares/errorHandler';
import { StatusCodes } from 'http-status-codes';

const adminRouter = Router();
adminRouter.use(authenticate);
adminRouter.use(requirePermission('roles:manage'));

// List all roles with their permissions
adminRouter.get('/roles', async (req, res) => {
    const roles = await prisma.role.findMany({
        include: {
            permissions: { include: { permission: true } },
            _count: { select: { users: true } },
        },
    });

    res.json({
        success: true,
        data: roles.map(role => ({
            id: role.id,
            name: role.name,
            description: role.description,
            isDefault: role.isDefault,
            userCount: role._count.users,
            permissions: role.permissions.map(rp => rp.permission.name),
        })),
    });
});

// Assign a role to a user
adminRouter.post('/users/:userId/roles', async (req, res, next) => {
    try {
        const { userId } = req.params;
        const { roleName } = req.body;

        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) throw new CustomException('User not found', StatusCodes.NOT_FOUND);

        const role = await prisma.role.findUnique({ where: { name: roleName } });
        if (!role) throw new CustomException(`Role '${roleName}' not found`, StatusCodes.NOT_FOUND);

        await prisma.userRole.upsert({
            where: { userId_roleId: { userId, roleId: role.id } },
            update: {},
            create: {
                userId,
                roleId: role.id,
                assignedBy: req.user!.id,
            },
        });

        // Audit event
        appEvents.emit('admin:role-assigned', {
            targetUserId: userId,
            roleName,
            assignedBy: req.user!.id,
        });

        res.json({
            success: true,
            data: { message: `Role '${roleName}' assigned to user` },
        });
    } catch (error) { next(error); }
});

// Revoke a role from a user
adminRouter.delete('/users/:userId/roles/:roleName',
    async (req, res, next) => {
        try {
            const { userId, roleName } = req.params;

            const role = await prisma.role.findUnique({
                where: { name: roleName },
            });
            if (!role) throw new CustomException('Role not found', StatusCodes.NOT_FOUND);

            await prisma.userRole.deleteMany({
                where: { userId, roleId: role.id },
            });

            appEvents.emit('admin:role-revoked', {
                targetUserId: userId,
                roleName,
                revokedBy: req.user!.id,
            });

            res.json({
                success: true,
                data: { message: `Role '${roleName}' revoked` },
            });
        } catch (error) { next(error); }
    }
);

export default adminRouter;
