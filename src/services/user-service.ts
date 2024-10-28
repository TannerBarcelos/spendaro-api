import type { FastifyInstance } from "fastify";

import type { TFoundUserResult } from "@/handlers/auth/auth-schemas";
import type { IUserRepository } from "@/repositories";

import { BadRequestError, NotFoundError } from "@/utils/error";

export class UserService {
  constructor(private server: FastifyInstance, private userRepo: IUserRepository) {
    this.userRepo = userRepo;
    this.server = server;
  }

  async findUserById(id: number): Promise<TFoundUserResult> {
    const foundUser = await this.userRepo.findUserById(id);
    if (!foundUser) {
      throw new NotFoundError("The requested user does not exist", [`User with id ${id} does not exist`]);
    }
    return foundUser;
  }
}
