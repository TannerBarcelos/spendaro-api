import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

import type { AuthService } from "@/services/auth-service";

import * as auth_schemas from "@/handlers/auth/auth-schemas";
import { errorResponseSchema } from "@/handlers/error/error-schemas";
import { STATUS_CODES } from "@/utils/http";
import { generateAccessToken, generateRefreshToken } from "@/utils/jwt";

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
          summary: "Sign up a new user",
          tags: ["auth"],
          body: auth_schemas.signupUserSchema,
          response: {
            [STATUS_CODES.CREATED]: auth_schemas.commonAuthResponseSchema,
            [STATUS_CODES.CONFLICT]: auth_schemas.duplicateSignupUserSchema,
            "5xx": errorResponseSchema,
          },
        },
        handler: async (request, reply) => {
          const createdUser = await this.authService.createUser(request.body);
          const accessToken = generateAccessToken(request.server.jwt, createdUser.id);
          const refreshToken = generateRefreshToken(request.server.jwt, createdUser.id);
          reply
            .setCookie("accessToken", accessToken)
            .setCookie("refreshToken", refreshToken, {
              maxAge: 60 * 60 * 24 * 7, // 7 days (refresh token expiry is 7 days)
            })
            .code(STATUS_CODES.OK)
            .send({
              message: "User created and signed in successfully",
            });
        },
      });

    server
      .withTypeProvider<ZodTypeProvider>()
      .route({
        method: "POST",
        url: "/signin",
        schema: {
          summary: "Sign in a user",
          tags: ["auth"],
          body: auth_schemas.signinUserSchema,
          response: {
            [STATUS_CODES.OK]: auth_schemas.commonAuthResponseSchema,
            [STATUS_CODES.UNAUTHORIZED]: auth_schemas.signinResponseUnauthorizedSchema,
            "5xx": errorResponseSchema,
          },
        },
        handler: async (request, reply) => {
          const validatedUser = await this.authService.findUserAndValidateToken(request.body);
          const accessToken = generateAccessToken(request.server.jwt, validatedUser.id);
          const refreshToken = generateRefreshToken(request.server.jwt, validatedUser.id);
          reply
            .setCookie("accessToken", accessToken)
            .setCookie("refreshToken", refreshToken, {
              maxAge: 60 * 60 * 24 * 7, // 7 days (refresh token expiry is 7 days)
            })
            .code(STATUS_CODES.OK)
            .send({
              message: "User signed in successfully",
            });
        },
      });

    server
      .withTypeProvider<ZodTypeProvider>()
      .route({
        url: "/refresh",
        method: "POST",
        schema: {
          summary: "Refresh user token",
          tags: ["auth"],
          response: {
            [STATUS_CODES.OK]: auth_schemas.commonAuthResponseSchema,
            [STATUS_CODES.UNAUTHORIZED]: auth_schemas.signinResponseUnauthorizedSchema,
            "5xx": errorResponseSchema,
          },
        },
        handler: async (request, reply) => {
          const validatedUser = await this.authService.findUserAndValidateToken(request.body);
          const token = generateAccessToken(request.server.jwt, validatedUser.id);
          reply
            .code(STATUS_CODES.OK)
            .send(
              {
                data: { access_token: token },
                message: "Token refreshed successfully",
              },
            );
        },
      });
  }
}
