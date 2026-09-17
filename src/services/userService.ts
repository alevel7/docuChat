import type { User } from "@prisma/client";

import { UserRepository } from "../repositories/userRepository";
import { UserCreateInput } from "../generated/prisma/models/User";
import { CustomException } from "../middlewares/errorHandler";
import { StatusCodes } from "http-status-codes";
import { UpdateUserBodyType } from "../schemas/user.schema";

export class UserService {
  constructor(private readonly userRepository: UserRepository = new UserRepository()) {}

  async listUsers(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  async createUser(data: UserCreateInput): Promise<User> {
    const firstName = data.firstName.trim();
    const lastName = data.lastName.trim();
    const n = firstName + " " + lastName;
    const email = data.email.trim().toLowerCase();

    if (!n || !email) {
      throw new CustomException("Name and email are required.", StatusCodes.BAD_REQUEST);
    }

    const existingUser = await this.userRepository.findByEmail(email);

    if (existingUser) {
      throw new CustomException("A user with this email already exists.", StatusCodes.CONFLICT);
    }

    return this.userRepository.create({ firstName, lastName, email, password: data.password });
  }

  async updateUser(userId: number, data: UpdateUserBodyType): Promise<User> {
    const firstName = data?.firstName?.trim();
    const lastName = data?.lastName?.trim();

    if (!firstName || !lastName) {
      throw new CustomException("First name and last name are required.", StatusCodes.BAD_REQUEST);
    }

    return this.userRepository.update(userId, { firstName, lastName });
  }
}
