import type { FastifyInstance } from "fastify";

import { StatusCodes } from "http-status-codes";

import type { TCandidateUser, TFoundUserResult, TUserToCreate } from "@/handlers/auth/auth-schemas";
import type { IAuthRepository } from "@/repositories/auth-repository";

import { SpendaroError } from "@/utils/error";

export class AuthService {
  constructor(private server: FastifyInstance, private authRepo: IAuthRepository) {
    this.authRepo = authRepo;
    this.server = server;
  }

  async signup(user: TUserToCreate): Promise<TFoundUserResult> {
    const hashedPassword = await this.server.bcrypt.hash(user.password);
    const signedUpUser = await this.authRepo.signup({
      ...user,
      password: hashedPassword,
    });
    return signedUpUser;
  }

  async signin(
    candidateUser: TCandidateUser,
  ): Promise<TFoundUserResult> {
    const foundUser = await this.authRepo.signin(candidateUser);

    if (!foundUser) {
      throw new SpendaroError("User does not exist", StatusCodes.UNAUTHORIZED);
    }

    const isValid = await this.server.bcrypt.compare(candidateUser.password, foundUser.password);

    if (!isValid) {
      throw new SpendaroError(
        "Invalid credentials. Passwords do not match.",
        StatusCodes.UNAUTHORIZED,
      );
    }

    return foundUser;
  }
}
