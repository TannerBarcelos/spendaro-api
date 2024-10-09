import type { FastifyInstance } from "fastify";

import { StatusCodes } from "http-status-codes";

import type { TUser, TUserResult } from "../db/types.js";
import type { IAuthRepository } from "../repositories/auth-repository.js";

import { SpendaroError } from "../utils/error.js";

export class AuthService {
  authRepo: IAuthRepository;
  server: FastifyInstance;
  constructor(server: FastifyInstance, authRepo: IAuthRepository) {
    this.authRepo = authRepo;
    this.server = server;
  }

  async signup(user: TUser): Promise<TUserResult> {
    const hashedPassword = await this.server.bcrypt.hash(user.password);
    return await this.authRepo.signup({
      ...user,
      password: hashedPassword,
    });
  }

  async signin(
    candidateUser: Pick<TUser, "email" | "password">,
  ): Promise<TUserResult> {
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
