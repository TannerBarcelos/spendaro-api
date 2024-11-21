import type { FastifyInstance } from "fastify";

import { UserHandlers } from "@/handlers/user/user-handlers";
import { UserRepository } from "@/repositories/user-repository";
import { UserService } from "@/services/user-service";

export async function userRoutes(instance: FastifyInstance) {
  const userRepo = new UserRepository(instance.db);
  const userService = new UserService(userRepo);
  const userHandlers = new UserHandlers(userService);
  userHandlers.registerHandlers(instance);
}
