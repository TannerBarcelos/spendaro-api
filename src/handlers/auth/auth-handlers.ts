import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

import type { AuthService } from "@/services/auth-service";

import { duplicateSignupUserSchema, signinResponseSchema, signinResponseUnauthorizedSchema, signinUserSchema, signupResponseSchema, signupUserSchema } from "@/handlers/auth/auth-schemas";
import { errorResponseSchema } from "@/handlers/error/error-schemas";
import { STATUS_CODES } from "@/utils/http";
import { generateAccessToken } from "@/utils/jwt";

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
          const createdUser = await this.authService.createUser(request.body);
          const token = generateAccessToken(request, createdUser.id);
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
          body: signinUserSchema, // body is validated against the signinUserSchema and provided as fully-type-safe request.body to our handler (all provided by the fastify-type-provider-zod plugin)
          response: {
            [STATUS_CODES.OK]: signinResponseSchema,
            [STATUS_CODES.UNAUTHORIZED]: signinResponseUnauthorizedSchema,
            "5xx": errorResponseSchema,
          },
        },
        handler: async (request, reply) => {
          const validatedUser = await this.authService.findUserAndValidateToken(request.body);
          const token = generateAccessToken(request, validatedUser.id);
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
