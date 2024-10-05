import {
  FastifyInstance,
  FastifyPluginCallback,
  FastifyPluginOptions,
  FastifyReply,
  FastifyRequest,
} from 'fastify';
import fp from 'fastify-plugin';
import jwt from '@fastify/jwt';
import { STATUS_CODES } from '@/utils/http';

const authenticate: FastifyPluginCallback = async (
  fastify: FastifyInstance,
  _: FastifyPluginOptions
) => {
  const secret = process.env.JWT_SECRET ?? 'jwtsupersecretkey';
  // Register the fastify-jwt plugin and adds a decorator to the fastify instance
  fastify.register(jwt, {
    secret,
    cookie: {
      cookieName: 'token',
      signed: false,
    },
  });

  // Decorate the fastify instance with an authenticate method which we can call that uses this plugin to verify the JWT
  fastify.decorate(
    'authenticate',
    async function (request: FastifyRequest, reply: FastifyReply) {
      try {
        await request.jwtVerify();
      } catch (err) {
        reply.status(STATUS_CODES.UNAUTHORIZED).send(err);
      }
    }
  );
};

export default fp(authenticate);
