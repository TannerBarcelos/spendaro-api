import type { FastifyInstance } from "fastify";

import { StatusCodes } from "http-status-codes";

import type { TCandidateUser, TFoundUserResult, TUserToCreate } from "@/db/types";
import type { IAuthRepository } from "@/repositories/auth-repository";

import { SpendaroError } from "@/utils/error";

export class AuthService {
  constructor(private server: FastifyInstance, private authRepo: IAuthRepository) {
    this.authRepo = authRepo;
    this.server = server;
  }

  async signup(user: TUserToCreate): Promise<TFoundUserResult> {
    const hashedPassword = await this.server.bcrypt.hash(user.password);
    return await this.authRepo.signup({
      ...user,
      password: hashedPassword,
    });
  }

  async signin(
    candidateUser: TCandidateUser,
  ): Promise<TFoundUserResult> {
    const signedInUser = await this.authRepo.signin(candidateUser);

    if (!signedInUser) {
      throw new SpendaroError("User does not exist", StatusCodes.UNAUTHORIZED);
    }

    const isValid = await this.server.bcrypt.compare(candidateUser.password, signedInUser.password);

    if (!isValid) {
      throw new SpendaroError(
        "Invalid credentials. Passwords do not match.",
        StatusCodes.UNAUTHORIZED,
      );
    }

    return signedInUser;
  }
}
