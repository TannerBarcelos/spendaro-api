import type { FastifyInstance } from "fastify";

import type { TFoundUserResult, TUserToCreate } from "@/handlers/auth/auth-schemas";
import type { IAuthRepository } from "@/repositories";

import { BadRequestError, NotFoundError } from "@/utils/error";

export class AuthService {
  constructor(private server: FastifyInstance, private authRepo: IAuthRepository) {
    this.authRepo = authRepo;
    this.server = server;
  }

  async createUser(candidateUser: TUserToCreate): Promise<TFoundUserResult> {
    const foundUser = await this.authRepo.findUserByEmail(candidateUser.email);

    if (foundUser) {
      throw new BadRequestError("User already exists. Please sign in.", [`User with email ${candidateUser.email} already exists`]);
    }

    const hashedPassword = await this.server.bcrypt.hash(candidateUser.password);
    const createdUser = await this.authRepo.createUser({
      ...candidateUser,
      password: hashedPassword,
    });
    return createdUser;
  }

  async findUserByEmail(
    email: string,
  ): Promise<TFoundUserResult> {
    const foundUser = await this.authRepo.findUserByEmail(email);
    if (!foundUser) {
      throw new NotFoundError("The requested user does not exist", [`User with email ${email} does not exist`]);
    }
    return foundUser;
  }

  async findUserById(id: number): Promise<TFoundUserResult> {
    const foundUser = await this.authRepo.findUserById(id);
    if (!foundUser) {
      throw new NotFoundError("The requested user does not exist", [`User with id ${id} does not exist`]);
    }
    return foundUser;
  }
}
