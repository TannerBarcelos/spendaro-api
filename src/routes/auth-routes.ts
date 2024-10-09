import type { FastifyInstance } from "fastify";

import { AuthHandlers } from "../handlers/auth-handlers.js";
import { AuthRepository } from "../repositories/auth-repository.js";
import { AuthService } from "../services/auth-service.js";

export async function authRoutes(server: FastifyInstance) {
  const authRepo = new AuthRepository(server.db);
  const authService = new AuthService(server, authRepo);
  const authHandlers = new AuthHandlers(authService);
  authHandlers.registerHandlers(server);
}
