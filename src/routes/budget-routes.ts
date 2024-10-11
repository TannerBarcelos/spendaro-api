import type { FastifyInstance } from "fastify";

import { BudgetHandlers } from "@/handlers/budget-handlers.js";
import { BudgetRepository } from "@/repositories/budget-repository.js";
import { BudgetService } from "@/services/budget-service.js";

export async function budgetRoutes(server: FastifyInstance) {
  server.addHook("onRequest", server.authenticate); // Add authentication hook to protect all budget routes from unauthorized access
  const budgetRepo = new BudgetRepository(server.db);
  const budgetService = new BudgetService(budgetRepo);
  const budgetHandlers = new BudgetHandlers(budgetService);
  budgetHandlers.registerHandlers(server);
}
