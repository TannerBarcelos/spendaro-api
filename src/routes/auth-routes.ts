import type { FastifyInstance } from "fastify";

import { AuthHandlers } from "@/handlers/auth-handlers.js";
import { AuthRepository } from "@/repositories/auth-repository.js";
import { AuthService } from "@/services/auth-service.js";

export async function authRoutes(authRouteInstance: FastifyInstance) {
  const authRepo = new AuthRepository(authRouteInstance.db);
  const authService = new AuthService(authRouteInstance, authRepo);
  const authHandlers = new AuthHandlers(authService);
  authHandlers.registerHandlers(authRouteInstance);
}
