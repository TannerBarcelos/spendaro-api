import type {
  FastifyInstance,
  FastifyPluginCallback,
  FastifyReply,
  FastifyRequest,
} from "fastify";

import jwt from "@fastify/jwt";
import fp from "fastify-plugin";

import { env } from "@/env";
import { STATUS_CODES } from "@/utils/http";

const authenticate: FastifyPluginCallback = async (
  fastify: FastifyInstance,
) => {
  // Register the fastify-jwt plugin and adds a decorator to the fastify instance
  fastify.register(jwt, {
    secret: env.JWT_SECRET,
  });

  // Decorate the fastify instance with an authenticate method which we can call that uses this plugin to verify the JWT
  fastify.decorate(
    "authenticate",
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        await request.jwtVerify(); // adds a user object to the request if the JWT is valid, containing the decoded JWT payload (which is just the user ID in our case since that's all we stored in the token when we signed it)
      }
      catch (err) {
        reply.status(STATUS_CODES.UNAUTHORIZED).send(err);
      }
    },
  );
};

export default fp(authenticate);
