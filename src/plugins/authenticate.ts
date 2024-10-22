import type {
  FastifyInstance,
  FastifyPluginCallback,
  FastifyRequest,
} from "fastify";

import jwt from "@fastify/jwt";
import fp from "fastify-plugin";

import { env } from "@/env";
import { ForbiddenError, UnauthorizedError } from "@/utils/error";

const authenticate: FastifyPluginCallback = async (
  fastify: FastifyInstance,
) => {
  // Register the fastify-jwt plugin and adds a decorator to the fastify instance
  fastify.register(jwt, {
    secret: env.JWT_SECRET,
    cookie: {
      cookieName: "accessToken", // will look for a cookie named "accessToken" to get the JWT from (instead of the Authorization header)
      signed: false,
    },
  });

  // Decorate the fastify instance with an authenticate method which we can call that uses this plugin to verify the JWT
  fastify.decorate(
    "authenticate",
    async (request: FastifyRequest) => {
      try {
        await request.jwtVerify(); // adds a user object to the request if the JWT is valid, containing the decoded JWT payload (which is just the user ID in our case since that's all we stored in the token when we signed it)
      }
      catch (err) {
        if (err instanceof Error) {
          throw new ForbiddenError(err.message, [err.message]);
        }
      }
    },
  );
};

export default fp(authenticate);
