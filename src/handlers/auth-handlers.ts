import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

import config from "config";
import { getReasonPhrase } from "http-status-codes";

import type { TUser } from "@/db/types";
import type { AuthService } from "@/services/auth-service";

import { insertUserSchema } from "@/db/types";
import { prepareResponse, STATUS_CODES } from "@/utils/http";

const sharedJwtSigningConfig = {
  expiresIn: config.get<string>("security.jwt.expires_in") ?? "15m",
};

class AuthHandlers {
  private authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  async signupUserHandler(request: FastifyRequest, reply: FastifyReply) {
    const user = insertUserSchema.parse(request.body);
    const signedUpUser = await this.authService.signup(user);
    const token = request.server.jwt.sign(
      {
        user_id: signedUpUser.id,
      },
      sharedJwtSigningConfig,
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
    const user = request.body as Pick<TUser, "email" | "password">;
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
          description:
            "Sign up a new user with an email and password and first and last name",
          summary: "Sign up a new user",
          tags: ["auth"],
          body: {
            type: "object",
            properties: {
              email: {
                type: "string",
                format: "email",
                description: "The users email",
              },
              password: { type: "string", description: "The users password" },
              firstName: {
                type: "string",
                description: "The users first name",
              },
              lastName: { type: "string", description: "The users last name" },
            },
            required: ["email", "password", "firstName", "lastName"],
          },
          response: {
            201: {
              type: "object",
              properties: {
                status: {
                  type: "number",
                  default: 201,
                  description: "HTTP status code",
                },
                message: {
                  type: "string",
                  default: "User created successfully",
                  description:
                    "A message indicating the success of the operation",
                },
                data: {
                  type: "string",
                  description:
                    "The actual data payload returned from the operation",
                },
                error: {
                  type: "string",
                  default: null,
                  description: "Any error message",
                },
              },
            },
            500: {
              type: "object",
              properties: {
                status: { type: "number", default: 500 },
                message: { type: "string", default: "Internal Server Error" },
                data: { type: "null" },
                error: { type: "string" }, // no default value because it's an internal server error, and the error can be anything
              },
            },
          },
        },
      },
      this.signupUserHandler.bind(this),
    ); // bind the context of the class to the handler so that 'this' refers to the class instance that gets created (this is not a Fastify thing, it's a JavaScript thing required because I am referencing 'this' inside the class methods)
    server.post(
      "/signin",
      {
        schema: {
          description: "Sign in a new user using email and password",
          summary: "Sign in a new user",
          tags: ["auth"],
          body: {
            type: "object",
            properties: {
              email: {
                type: "string",
                format: "email",
                description: "The users email used to sign up for Spendaro",
              },
              password: { type: "string", description: "The users password" },
            },
            required: ["email", "password"],
          },
          response: {
            "200": {
              type: "object",
              properties: {
                status: {
                  type: "number",
                  default: 200,
                  description: "HTTP status code",
                },
                message: {
                  type: "string",
                  default: "User signed in successfully",
                  description:
                    "A message indicating the success of the operation",
                },
                data: {
                  type: "object",
                  description:
                    "The actual data payload returned from the operation",
                  properties: {
                    access_token: {
                      type: "string",
                      description: "JWT access token",
                    },
                    // refresh_token: {
                    //   type: 'string',
                    //   description: 'JWT refresh token',
                    // },
                  },
                },
                error: {
                  type: "string",
                  default: null,
                  description: "Any error message",
                },
              },
            },
            "401": {
              type: "object",
              properties: {
                status: { type: "number", default: 401 },
                message: { type: "string", default: "Unauthorized" },
                data: { type: "null" },
                error: { type: "string", default: null }, // 401 is not an error, it's a status code therefore the error message should be null
              },
            },
            "5xx": {
              type: "object",
              properties: {
                status: { type: "number", default: 500 },
                message: { type: "string", default: "Internal Server Error" },
                data: { type: "null" },
                error: { type: "string" }, // no default value because it's an internal server error, and the error can be anything
              },
            },
          },
        },
      },
      this.signinUserHandler.bind(this),
    );
  }
}

export { AuthHandlers };
