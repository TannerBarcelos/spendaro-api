import type { User } from "@clerk/fastify";
import type {
  FastifyInstance,
  FastifyPluginCallback,
  FastifyRequest,
} from "fastify";

import { clerkClient, getAuth } from "@clerk/fastify";
import fp from "fastify-plugin";

import { ForbiddenError } from "@/utils/error";

const authenticate: FastifyPluginCallback = async (
  server: FastifyInstance,
) => {
  server.decorate(
    "authenticate",
    async (request: FastifyRequest) => {
      const { userId } = getAuth(request);
      if (!userId) {
        throw new ForbiddenError("Access denied. Authentication required.");
      }
      const user = await clerkClient.users.getUser(userId);
      request.user = user;
    },
  );
};

export default fp(authenticate);
