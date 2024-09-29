import { FastifyInstance } from 'fastify';
import { AuthHandlers } from '@/handlers/auth-handlers';
import { AuthRepository } from '@/repositories/auth-repository';
import { AuthService } from '@/services/auth-service';

export default async function (authRouteInstance: FastifyInstance) {
  const authRepo = new AuthRepository(authRouteInstance.db);
  const authService = new AuthService(authRouteInstance, authRepo);
  const authHandlers = new AuthHandlers(authService);
  authHandlers.registerHandlers(authRouteInstance);
}
