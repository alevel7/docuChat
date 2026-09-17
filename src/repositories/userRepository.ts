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
      where: { email: email.toLowerCase().trim() },
    });
  }

  async create(data: UserCreateInput): Promise<User> {
    return prisma.user.create({
      data,
    });
  }

  async update(userId: number, data: { firstName: string; lastName: string }): Promise<User> {
    return prisma.user.update({
      where: { id: userId },
      data,
    });
  }
}
