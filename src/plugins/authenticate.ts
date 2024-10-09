import type {
  FastifyInstance,
  FastifyPluginCallback,
  FastifyPluginOptions,
  FastifyReply,
  FastifyRequest,
} from "fastify";

import jwt from "@fastify/jwt";
import fp from "fastify-plugin";

import { env } from "../env.js";
import { STATUS_CODES } from "../utils/http.js";

const authenticate: FastifyPluginCallback = async (
  fastify: FastifyInstance,
  _: FastifyPluginOptions,
) => {
  const secret = env.JWT_SECRET ?? "jwtsupersecretkey";
  // Register the fastify-jwt plugin and adds a decorator to the fastify instance
  fastify.register(jwt, {
    secret,
    cookie: {
      cookieName: "token",
      signed: false,
    },
  });

  // Decorate the fastify instance with an authenticate method which we can call that uses this plugin to verify the JWT
  fastify.decorate(
    "authenticate",
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        await request.jwtVerify();
      }
      catch (err) {
        reply.status(STATUS_CODES.UNAUTHORIZED).send(err);
      }
    },
  );
};

export default fp(authenticate);
