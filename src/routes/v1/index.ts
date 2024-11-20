import type { FastifyInstance } from "fastify";

import { budgetRoutes } from "./budget-routes";
import { userRoutes } from "./user-routes";

export async function v1(server: FastifyInstance) {
  await server.register(budgetRoutes, { prefix: "/budgets" });
  await server.register(userRoutes, { prefix: "/user" });
}
