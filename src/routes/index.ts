import type { FastifyInstance } from "fastify";

import { authRoutes } from "./auth-routes";
import { budgetRoutes } from "./budget-routes";

export async function routes(server: FastifyInstance) {
  server.register(authRoutes, { prefix: "/auth" });
  server.register(budgetRoutes, { prefix: "/budgets" });
}
