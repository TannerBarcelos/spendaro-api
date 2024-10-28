import type { FastifyInstance } from "fastify";

import { UserHandlers } from "@/handlers/user/user-handlers";
import { UserRepository } from "@/repositories/user-repository";
import { UserService } from "@/services/user-service";

export async function userRoutes(server: FastifyInstance) {
  server.addHook("onRequest", server.authenticate);
  const userRepo = new UserRepository(server.db);
  const userService = new UserService(server, userRepo);
  const userHandlers = new UserHandlers(userService);
  userHandlers.registerHandlers(server);
}
