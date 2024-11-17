import type { FastifyInstance } from "fastify";

import { clerkClient, getAuth } from "@clerk/fastify";

import { BudgetHandlers } from "@/handlers/budget/budget-handlers";
import { BudgetRepository } from "@/repositories/budget-repository";
import { BudgetService } from "@/services/budget-service";
import { ForbiddenError } from "@/utils/error";

export async function budgetRoutes(instance: FastifyInstance) {
  instance.addHook("preHandler", async (request, _) => {
    const { userId } = getAuth(request); // Pass the request object instead of instance.server
    if (!userId) {
      throw new ForbiddenError("Access denied. Authentication required.");
    }
    request.user = await clerkClient.users.getUser(userId);
  });
  const budgetRepo = new BudgetRepository(instance.db);
  const budgetService = new BudgetService(budgetRepo);
  const budgetHandlers = new BudgetHandlers(budgetService);
  budgetHandlers.registerHandlers(instance);
}
