import type { FastifyInstance } from "fastify";

import type { TFoundUserResult } from "@/handlers/auth/auth-schemas";
import type { TUserToUpdate } from "@/handlers/user/user-schemas";
import type { IUserRepository } from "@/repositories";

import { NotFoundError } from "@/utils/error";

export class UserService {
  constructor(private userRepo: IUserRepository) {}

  async findUserById(id: number): Promise<TFoundUserResult> {
    const foundUser = await this.userRepo.findUserById(id);
    if (!foundUser) {
      throw new NotFoundError("The requested user does not exist", [`User with id ${id} does not exist`]);
    }
    return foundUser;
  }

  async updateUser(id: number, user_to_update: TUserToUpdate): Promise<TFoundUserResult> {
    const foundUser = await this.userRepo.findUserById(id);
    if (!foundUser) {
      throw new NotFoundError("The requested user does not exist", [`User with id ${id} does not exist`]);
    }
    const updatedUser = await this.userRepo.updateUser(id, user_to_update);
    return updatedUser;
  }

  async deleteUser(user_id: number): Promise<TFoundUserResult> {
    const foundUser = await this.userRepo.findUserById(user_id);
    if (!foundUser) {
      throw new NotFoundError("The requested user does not exist", [`User with id ${user_id} does not exist`]);
    }
    const deletedUser = await this.userRepo.deleteUser(user_id);
    return deletedUser;
  }
}
