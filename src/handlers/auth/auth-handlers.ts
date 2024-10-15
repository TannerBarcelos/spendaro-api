import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

import config from "config";

import type { AuthService } from "@/services/auth-service";

import { duplicateSignupUserSchema, signinResponseSchema, signinResponseUnauthorizedSchema, signinUserSchema, signupResponseSchema, signupUserSchema } from "@/handlers/auth/auth-schemas";
import { errorResponseSchema } from "@/handlers/error/error-schemas";
import { STATUS_CODES } from "@/utils/http";

export class AuthHandlers {
  constructor(private authService: AuthService) {
    this.authService = authService;
  }

  registerHandlers(server: FastifyInstance) {
    server
      .withTypeProvider<ZodTypeProvider>()
      .route({
        method: "POST",
        url: "/signup",
        schema: {
          tags: ["auth"],
          body: signupUserSchema,
          response: {
            [STATUS_CODES.CREATED]: signupResponseSchema,
            [STATUS_CODES.CONFLICT]: duplicateSignupUserSchema,
            "5xx": errorResponseSchema,
          },
        },
        handler: async (request, reply) => {
          const signedUpUser = await this.authService.signup(request.body);

          const token = request.server.jwt.sign(
            {
              user_id: signedUpUser.id,
            },
            {
              expiresIn: config.get<string>("security.jwt.expires_in") ?? "15m",
            },
          );
          reply
            .code(STATUS_CODES.CREATED)
            .send(
              {
                data: { access_token: token },
                message: "User created successfully",
              },
            );
        },
      });

    server
      .withTypeProvider<ZodTypeProvider>()
      .route({
        method: "POST",
        url: "/signin",
        schema: {
          tags: ["auth"],
          body: signinUserSchema,
          response: {
            [STATUS_CODES.OK]: signinResponseSchema,
            [STATUS_CODES.UNAUTHORIZED]: signinResponseUnauthorizedSchema,
            "5xx": errorResponseSchema,
          },
        },
        handler: async (request, reply) => {
          const signedInUser = await this.authService.signin(request.body);

          const token = request.server.jwt.sign(
            {
              user_id: signedInUser.id,
            },
            {
              expiresIn: config.get("security.jwt.expires_in") ?? "15m",
            },
          );

          reply
            .code(STATUS_CODES.OK)
            .send(
              {
                data: { access_token: token },
                message: "User signed in successfully",
              },
            );
        },
      });
  }
}
