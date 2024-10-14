import type { FastifyInstance } from "fastify";

import { AuthHandlers } from "@/handlers/auth/auth-handlers";
import { AuthRepository } from "@/repositories/auth-repository";
import { AuthService } from "@/services/auth-service";

export async function authRoutes(server: FastifyInstance) {
  const authRepo = new AuthRepository(server.db);
  const authService = new AuthService(server, authRepo);
  const authHandlers = new AuthHandlers(authService);
  authHandlers.registerHandlers(server);
}
