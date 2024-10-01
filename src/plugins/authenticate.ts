import {
  FastifyInstance,
  FastifyPluginCallback,
  FastifyPluginOptions,
  FastifyReply,
  FastifyRequest,
} from 'fastify';
import fp from 'fastify-plugin';
import jwt from '@fastify/jwt';
import { STATUS_CODES } from '@/util/http';

const authenticate: FastifyPluginCallback = async (
  fastify: FastifyInstance,
  _: FastifyPluginOptions
) => {
  const secret = process.env.JWT_SECRET ?? 'jwtsupersecretkey';
  fastify.register(jwt, {
    secret,
    cookie: {
      cookieName: 'token',
      signed: false,
    },
  });
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
