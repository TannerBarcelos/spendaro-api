import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

import { z } from "zod";

import type { UserService } from "@/services/user-service";

import { errorResponseSchema } from "@/handlers/error/error-schemas";
import { UnauthorizedError } from "@/utils/error";
import { STATUS_CODES } from "@/utils/http";

import * as user_schemas from "./user-schemas";

export class UserHandlers {
  constructor(private userService: UserService) {
    this.userService = userService;
  }

  registerHandlers(server: FastifyInstance) {
    server
      .withTypeProvider<ZodTypeProvider>()
      .route({
        preHandler: server.authenticate,
        url: "/user-details",
        method: "GET",
        schema: {
          summary: "Get user details",
          description: "Get the details of the currently authenticated user",
          tags: ["users"],
          response: {
            [STATUS_CODES.OK]: user_schemas.userDetailsResponseSchema,
            "4xx": errorResponseSchema,
            "5xx": errorResponseSchema,
          },
        },
        handler: async (request, reply) => {
          const foundUser = await this.userService.findUserById(request.user.user_id);
          reply
            .code(STATUS_CODES.OK)
            .send({
              message: "User details fetched successfully",
              data: foundUser,
            });
        },
      });

    server.withTypeProvider<ZodTypeProvider>().route({
      preHandler: server.authenticate,
      url: "/update",
      method: "PUT",
      schema: {
        summary: "Update user details",
        description: "Update the details of the currently authenticated user. Only the fields that need to be updated should be provided. Often used for profile image updates.",
        tags: ["users"],
        body: user_schemas.updateUserSchema,
        response: {
          [STATUS_CODES.OK]: user_schemas.userDetailsResponseSchema,
          "4xx": errorResponseSchema,
          "5xx": errorResponseSchema,
        },
      },
      handler: async (request, reply) => {
        const updatedUser = await this.userService.updateUser(request.user.user_id, request.body);
        reply
          .code(STATUS_CODES.OK)
          .send({
            message: "User details updated successfully",
            data: updatedUser,
          });
      },
    });

    server.withTypeProvider<ZodTypeProvider>().route({
      preHandler: server.authenticate,
      url: "/delete",
      method: "DELETE",
      schema: {
        summary: "Delete user",
        description: "Delete the currently authenticated user",
        tags: ["users"],
        response: {
          [STATUS_CODES.OK]: user_schemas.userDeletedResponseSchema,
          "4xx": errorResponseSchema,
          "5xx": errorResponseSchema,
        },
      },
      handler: async (request, reply) => {
        await this.userService.deleteUser(request.user.user_id);
        reply
          .code(STATUS_CODES.OK)
          .send({
            message: "User deleted successfully",
          });
      },
    });

    server
      .withTypeProvider<ZodTypeProvider>()
      .route({
        preHandler: server.authenticate,
        url: "/upload-profile-image",
        method: "POST",
        schema: {
          summary: "Upload users profile image",
          description: "Upload the profile image of the currently authenticated user",
          tags: ["users"],
          response: {
            [STATUS_CODES.OK]: user_schemas.userDetailsResponseSchema,
            "4xx": errorResponseSchema,
            "5xx": errorResponseSchema,
          },
        },
        handler: async (request, reply) => {
          const foundUser = await this.userService.findUserById(request.user.user_id);
          reply
            .code(STATUS_CODES.OK)
            .send({
              message: "User details fetched successfully",
              data: foundUser,
            });
        },
      });
  }
}
