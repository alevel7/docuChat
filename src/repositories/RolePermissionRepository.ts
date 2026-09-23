import type { User } from "@prisma/client";

import prisma from "../config/database"
import { UserCreateInput } from "../generated/prisma/models/User";
import { Prisma, Role } from "../generated/prisma/client";

interface RolePermissionRepositoryInterface {
    findRole: (filter: Prisma.RoleWhereInput) => Promise<Role | null>;
    create: (data: UserCreateInput) => Promise<User>;
}

export const RolePermissionRepository: RolePermissionRepositoryInterface = {
    findRole: async (filter: Prisma.RoleWhereInput): Promise<Role | null> => {
        return prisma.role.findFirst({
            where: filter,
        });
    },

    create: async (data: UserCreateInput): Promise<User> => {
        return prisma.user.create({
            data,
        });
    },
}


export default RolePermissionRepository;