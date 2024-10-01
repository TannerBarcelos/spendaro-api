import { FastifyInstance } from 'fastify';
import { BudgetHandlers } from '@/handlers/budget-handlers';
import { BudgetRepository } from '@/repositories/budget-repository';
import { BudgetService } from '@/services/budget-service';

async function budgetRoutes(server: FastifyInstance) {

  // Add authentication hook to protect all budget routes from unauthorized access
  server.addHook('onRequest', server.authenticate);

  const budgetRepo = new BudgetRepository(server.db);
  const budgetService = new BudgetService(budgetRepo);
  const budgetHandlers = new BudgetHandlers(budgetService);
  budgetHandlers.registerHandlers(server);
}

export { budgetRoutes };
