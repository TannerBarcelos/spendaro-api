import type { FastifyInstance } from "fastify";

import { clerkClient, getAuth } from "@clerk/fastify";

import { UserHandlers } from "@/handlers/user/user-handlers";
import { UserRepository } from "@/repositories/user-repository";
import { UserService } from "@/services/user-service";
import { ForbiddenError } from "@/utils/error";

export async function userRoutes(instance: FastifyInstance) {
  instance.addHook("preHandler", async (request, _) => {
    const { userId } = getAuth(request);
    if (!userId) {
      throw new ForbiddenError("Access denied. Authentication required.");
    }
    request.user = await clerkClient.users.getUser(userId);
  });
  const userRepo = new UserRepository(instance.db);
  const userService = new UserService(userRepo);
  const userHandlers = new UserHandlers(userService);
  userHandlers.registerHandlers(instance);
}
