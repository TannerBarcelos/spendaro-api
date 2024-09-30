import { budgetRoutes } from './budget-routes';
import { authRoutes } from './auth-routes';
import { FastifyInstance } from 'fastify';

async function routes(server: FastifyInstance) {
  server.register(authRoutes, { prefix: '/auth' });
  server.register(budgetRoutes, { prefix: '/budgets' });
}

export { routes };