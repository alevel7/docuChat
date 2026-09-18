import type { User } from "@prisma/client";

import { UserRepository } from "../repositories/userRepository";
import { UserCreateInput } from "../generated/prisma/models/User";
import { CustomException } from "../middlewares/errorHandler";
import { StatusCodes } from "http-status-codes";
import { UpdateUserBodyType } from "../validators/user.validator";


const listUsers = async (): Promise<User[]> => {
  return await UserRepository.findAll();
};

const getUserByEmail = async (email: string): Promise<User | null> => {
  return await UserRepository.findByEmail(email);
};

const createUser = async (data: UserCreateInput): Promise<User> => {
  const firstName = data.firstName.trim();
  const lastName = data.lastName.trim();
  const n = firstName + " " + lastName;
  const email = data.email.trim().toLowerCase();

  if (!n || !email) {
    throw new CustomException("Name and email are required.", StatusCodes.BAD_REQUEST);
  }

  const existingUser = await UserRepository.findByEmail(email);

  if (existingUser) {
    throw new CustomException("A user with this email already exists.", StatusCodes.CONFLICT);
  }

  return await UserRepository.create({ firstName, lastName, email, password: data.password });
};

const updateUser = async (userId: string, data: UpdateUserBodyType): Promise<User> => {
  const firstName = data?.firstName?.trim();
  const lastName = data?.lastName?.trim();

  if (!firstName || !lastName) {
    throw new CustomException("First name and last name are required.", StatusCodes.BAD_REQUEST);
  }

  return await UserRepository.update(userId, { firstName, lastName });
};


const deleteUser = async (userId: string): Promise<void> => {
  const user = await UserRepository.findById(userId);

  if (!user) {
    throw new CustomException("User not found.", StatusCodes.NOT_FOUND);
  }

  await UserRepository.delete(userId);
}

const UserService = {
  listUsers,
  getUserByEmail,
  createUser,
  updateUser,
  deleteUser
}

export default UserService;
