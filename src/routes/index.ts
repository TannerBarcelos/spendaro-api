import type { FastifyInstance } from "fastify";

import { authRoutes } from "./auth-routes.js";
import { budgetRoutes } from "./budget-routes.js";

export async function routes(server: FastifyInstance) {
  server.register(authRoutes, { prefix: "/auth" });
  server.register(budgetRoutes, { prefix: "/budgets" });
}
