import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

import config from "config";
import { getReasonPhrase } from "http-status-codes";

import type { TInsertUser } from "@/db/types";
import type { AuthService } from "@/services/auth-service";

import { $ref, signupUserSchema } from "@/db/types";
import { prepareResponse, STATUS_CODES } from "@/utils/http";

export class AuthHandlers {
  private authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  async signupUserHandler(request: FastifyRequest<{
    Body: TInsertUser;
  }>, reply: FastifyReply) {
    const signedUpUser = await this.authService.signup(request.body);
    const token = request.server.jwt.sign(
      {
        user_id: signedUpUser.id,
      },
      {
        expiresIn: config.get<string>("security.jwt.expires_in") ?? "15m",
      },
    );
    reply.send(
      prepareResponse(
        { access_token: token },
        STATUS_CODES.CREATED,
        "User created successfully",
        null,
      ),
    );
  }

  async signinUserHandler(request: FastifyRequest, reply: FastifyReply) {
    const user = request.body as Pick<TInsertUser, "email" | "password">;
    const signedInUser = await this.authService.signin(user);

    if (!signedInUser) {
      reply.send(
        prepareResponse(
          null,
          STATUS_CODES.UNAUTHORIZED,
          getReasonPhrase(STATUS_CODES.UNAUTHORIZED),
          null,
        ),
      );
      return;
    }

    const token = request.server.jwt.sign(
      {
        user_id: signedInUser.id,
      },
      {
        expiresIn: config.get("security.jwt.expires_in") ?? "15m",
      },
    );

    reply.send(
      prepareResponse(
        { access_token: token },
        STATUS_CODES.OK,
        "User signed in successfully",
        null,
      ),
    );
  }

  registerHandlers(server: FastifyInstance) {
    server.post(
      "/signup",
      {
        schema: {
          body: $ref("signupUserSchema"),
        },
      },
      this.signupUserHandler.bind(this),
    ); // bind the context of the class to the handler so that 'this' refers to the class instance that gets created (this is not a Fastify thing, it's a JavaScript thing required because I am referencing 'this' inside the class methods)
    server.post(
      "/signin",
      {
        schema: {
          body: $ref("signinUserSchema"),
        },
      },
      this.signinUserHandler.bind(this),
    );
  }
}
