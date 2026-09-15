import type { User } from "@prisma/client";

import { UserRepository, type CreateUserInput } from "../repositories/userRepository";

export class UserService {
  constructor(private readonly userRepository: UserRepository = new UserRepository()) {}

  async listUsers(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  async createUser(data: CreateUserInput): Promise<User> {
    const name = data.name.trim();
    const email = data.email.trim().toLowerCase();

    if (!name || !email) {
      const error = new Error("Name and email are required.") as Error & { statusCode?: number };
      error.statusCode = 400;
      throw error;
    }

    const existingUser = await this.userRepository.findByEmail(email);

    if (existingUser) {
      const error = new Error("A user with this email already exists.") as Error & { statusCode?: number };
      error.statusCode = 409;
      throw error;
    }

    return this.userRepository.create({ name, email });
  }
}
