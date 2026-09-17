import type { User } from "@prisma/client";

import { UserRepository } from "../repositories/userRepository";
import { UserCreateInput } from "../generated/prisma/models/User";

export class UserService {
  constructor(private readonly userRepository: UserRepository = new UserRepository()) {}

  async listUsers(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  async createUser(data: UserCreateInput): Promise<User> {
    const firstName = data.firstName.trim();
    const lastName = data.lastName.trim();
    const n = firstName + " " + lastName;
    const email = data.email.trim().toLowerCase();

    if (!n || !email) {
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

    return this.userRepository.create({ firstName, lastName, email, password: data.password });
  }
}
