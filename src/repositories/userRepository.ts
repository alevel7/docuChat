import type { User } from "@prisma/client";

import prisma  from "../config/database"
import { UserCreateInput } from "../generated/prisma/models/User";

interface UserRepositoryInterface {
  findAll: () => Promise<User[]>;
  findByEmail: (email: string) => Promise<User | null>;
  findById: (userId: string) => Promise<User | null>;
  create: (data: UserCreateInput) => Promise<User>;
  update: (userId: string, data: { firstName: string; lastName: string }) => Promise<User>;
  delete: (userId: string) => Promise<void>;
}

export const UserRepository: UserRepositoryInterface = {
  findAll: async (): Promise<User[]> => {
    return prisma.user.findMany({
      orderBy: { createdAt: "asc" },
    });
  },

  findByEmail: async (email: string): Promise<User | null> => {
    return prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });
  },

  findById: async (userId: string): Promise<User | null> => {
    return prisma.user.findUnique({
      where: { id: userId },
    });
  },

  create: async (data: UserCreateInput): Promise<User> => {
    return prisma.user.create({
      data,
    });
  },

  update: async (userId: string, data: { firstName: string; lastName: string }): Promise<User> => {
    return prisma.user.update({
      where: { id: userId },
      data,
    });
  },
  delete: async (userId: string): Promise<void> => {
    await prisma.user.delete({
      where: { id: userId },
    });
  }
}
