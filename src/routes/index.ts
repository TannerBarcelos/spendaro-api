import type { FastifyInstance } from "fastify";

import { authRoutes } from "./auth-routes";
import { budgetRoutes } from "./budget-routes";
import { userRoutes } from "./user-routes";

export async function routes(server: FastifyInstance) {
  server.register(authRoutes, { prefix: "/auth" });
  server.register(budgetRoutes, { prefix: "/budgets" });
  server.register(userRoutes, { prefix: "/user" });
}
