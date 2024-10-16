import type { FastifyInstance } from "fastify";

import type { TCandidateUser, TFoundUserResult, TUserToCreate } from "@/handlers/auth/auth-schemas";
import type { IAuthRepository } from "@/repositories";

import { BadRequestError, NotFoundError, UnauthorizedError } from "@/utils/error";

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

  async findUserAndValidateToken(
    candidateUser: TCandidateUser,
  ): Promise<TFoundUserResult> {
    const foundUser = await this.authRepo.findUserByEmail(candidateUser.email);

    if (!foundUser) {
      throw new NotFoundError("The requested user does not exist", [`User with email ${candidateUser.email} does not exist`]);
    }

    const isValid = await this.server.bcrypt.compare(candidateUser.password, foundUser.password);

    if (!isValid) {
      throw new UnauthorizedError("Invalid email or password", ["The email or password provided is incorrect"]);
    }

    return foundUser;
  }
}
