import type {
  FastifyInstance,
  FastifyPluginCallback,
  FastifyRequest,
} from "fastify";

import fp from "fastify-plugin";

import { ForbiddenError } from "@/utils/error";

const authenticate: FastifyPluginCallback = async (
  server: FastifyInstance,
) => {
  // Decorate the fastify instance with an authenticate method which we can call that uses this plugin to verify the JWT
  server.decorate(
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
