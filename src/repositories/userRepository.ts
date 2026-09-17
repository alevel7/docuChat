import type { User } from "@prisma/client";

import prisma  from "../config/database"
import { UserCreateInput } from "../generated/prisma/models/User";

export class UserRepository {
  async findAll(): Promise<User[]> {
    return prisma.user.findMany({
      orderBy: { createdAt: "asc" },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async create(data: UserCreateInput): Promise<User> {
    return prisma.user.create({
      data,
    });
  }
}
