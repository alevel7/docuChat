import type { User } from "@prisma/client";

import prisma from "../config/database"
import { UserCreateInput } from "../generated/prisma/models/User";
import { UserRoleCreateInput } from "../generated/prisma/models";
import { Prisma, UserRole } from "../generated/prisma/client";

interface UserRoleRepositoryInterface {
    create: (data: UserRoleCreateInput) => Promise<UserRole>;
}

export const UserRoleRepository: UserRoleRepositoryInterface = {

    create: async (data: Prisma.UserRoleCreateInput): Promise<UserRole> => {
        return prisma.userRole.create({
            data,
        });
    },
}


export default UserRoleRepository;