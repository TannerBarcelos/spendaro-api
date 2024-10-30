import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

import { z } from "zod";

import type { AuthService } from "@/services/auth-service";

import * as auth_schemas from "@/handlers/auth/auth-schemas";
import { errorResponseSchema } from "@/handlers/error/error-schemas";
import { UnauthorizedError } from "@/utils/error";
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
            [STATUS_CODES.CREATED]: auth_schemas.authResponseSchema,
            [STATUS_CODES.CONFLICT]: errorResponseSchema,
            "5xx": errorResponseSchema,
          },
        },
        handler: async (request, reply) => {
          const { id } = await this.authService.createUser(request.body);
          const accessToken = generateAccessToken(request.server.jwt, id);
          const refreshToken = generateRefreshToken(request.server.jwt, id);
          reply
            .code(STATUS_CODES.OK)
            .send({
              accessToken,
              refreshToken,
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
            [STATUS_CODES.OK]: auth_schemas.authResponseSchema,
            "4xx": errorResponseSchema,
            "5xx": errorResponseSchema,
          },
        },
        handler: async (request, reply) => {
          const foundUser = await this.authService.findUserByEmail(request.body.email);
          const isValid = await request.server.bcrypt.compare(request.body.password, foundUser.password);

          if (!isValid) {
            throw new UnauthorizedError("Invalid email or password", ["The email or password provided is incorrect"]);
          }
          const accessToken = generateAccessToken(request.server.jwt, foundUser.id);
          const refreshToken = generateRefreshToken(request.server.jwt, foundUser.id);
          reply
            .code(STATUS_CODES.OK)
            .send({
              accessToken,
              refreshToken,
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
          description: "Refresh the user's access token using the refresh token. Often used after a client requests a resource and receives a 401 Unauthorized response.",
          tags: ["auth"],
          response: {
            [STATUS_CODES.OK]: auth_schemas.authResponseSchema,
            "4xx": errorResponseSchema,
            "5xx": errorResponseSchema,
          },
        },
        handler: async (request, reply) => {
          const refreshToken = request.headers.authorization?.split(" ")[1]; // Bearer <token>

          if (!refreshToken) {
            throw new UnauthorizedError("Refresh token not found", ["Refresh token was not provided in the request"]);
          }

          const { user_id } = request.server.jwt.verify<{ user_id: number }>(refreshToken);
          const accessToken = generateAccessToken(request.server.jwt, user_id);
          reply
            .code(STATUS_CODES.OK)
            .send(
              {
                accessToken,
                refreshToken,
              },
            );
        },
      });

    server
      .withTypeProvider<ZodTypeProvider>()
      .route({
        method: "GET",
        url: "/logout",
        schema: {
          summary: "Logout user",
          description: "Logout the user by clearing the cookies",
          tags: ["auth"],
          response: {
            [STATUS_CODES.OK]: z.object({
              message: z.string(),
            }),
            "5xx": errorResponseSchema,
          },
        },
        handler: async (_, reply) => {
          reply
            .code(STATUS_CODES.OK)
            .send({
              message: "User logged out successfully",
            });
        },
      });
  }
}
