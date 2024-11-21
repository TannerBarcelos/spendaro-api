import type { FastifyInstance } from "fastify";

import { BudgetHandlers } from "@/handlers/budget/budget-handlers";
import { BudgetRepository } from "@/repositories/budget-repository";
import { BudgetService } from "@/services/budget-service";

export async function budgetRoutes(instance: FastifyInstance) {
  const budgetRepo = new BudgetRepository(instance.db);
  const budgetService = new BudgetService(budgetRepo);
  const budgetHandlers = new BudgetHandlers(budgetService);
  budgetHandlers.registerHandlers(instance);
}
