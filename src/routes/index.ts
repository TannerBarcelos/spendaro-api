import budgetRoutes from './budget-routes';
import authRoutes from './auth-routes';
import { FastifyInstance, FastifyPluginOptions } from 'fastify';

export default async function routes(
  server: FastifyInstance,
  _: FastifyPluginOptions
) {
  server.register(authRoutes, { prefix: '/auth' });
  server.register(budgetRoutes, { prefix: '/budgets' });
}
