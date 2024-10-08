import type { FastifyInstance } from "fastify";

import { AuthHandlers } from "@/handlers/auth-handlers";
import { AuthRepository } from "@/repositories/auth-repository";
import { AuthService } from "@/services/auth-service";

export async function authRoutes(authRouteInstance: FastifyInstance) {
  const authRepo = new AuthRepository(authRouteInstance.db);
  const authService = new AuthService(authRouteInstance, authRepo);
  const authHandlers = new AuthHandlers(authService);
  authHandlers.registerHandlers(authRouteInstance);
}
