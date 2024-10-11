import type { FastifyInstance } from "fastify";

import { StatusCodes } from "http-status-codes";

import type { TInsertUser, TUserResult } from "@/db/types";
import type { IAuthRepository } from "@/repositories/auth-repository";

import { SpendaroError } from "@/utils/error";

export class AuthService {
  authRepo: IAuthRepository;
  server: FastifyInstance;
  constructor(server: FastifyInstance, authRepo: IAuthRepository) {
    this.authRepo = authRepo;
    this.server = server;
  }

  async signup(user: TInsertUser): Promise<TUserResult> {
    const hashedPassword = await this.server.bcrypt.hash(user.password);
    return await this.authRepo.signup({
      ...user,
      password: hashedPassword,
    });
  }

  async signin(
    candidateUser: Pick<TInsertUser, "email" | "password">,
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
