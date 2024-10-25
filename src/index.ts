/* eslint-disable no-console */
import type { FastifyInstance, FastifyRequest } from "fastify";

import cookie from "@fastify/cookie";
import cors from "@fastify/cors";
import limiter from "@fastify/rate-limit";
import swagger from "@fastify/swagger";
import scalar from "@scalar/fastify-api-reference";
import config from "config";
import fastify from "fastify";
import { fastifyBcrypt } from "fastify-bcrypt";
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import { getReasonPhrase, StatusCodes } from "http-status-codes";

import db from "@/db/index";
import { ErrorHandlers } from "@/handlers/error/error-handlers";
import { swaggerConfig, swaggerScalarConfig } from "@/open-api";
import authenticate from "@/plugins/authenticate";
import { routes } from "@/routes/index";
import { cookieConfig, corsConfig, rateLimiterConfig } from "@/utils/http";

import { cache, cacheConfig } from "./utils/cache";
import { bcryptSaltConfig } from "./utils/jwt";

const server = fastify({
  logger: {
    enabled: true,
    level: config.get("server.logging.level"),
  },
});

registerServerPlugins(server).then(() => {
  server.setValidatorCompiler(validatorCompiler);
  server.setSerializerCompiler(serializerCompiler);

  server.setErrorHandler(ErrorHandlers.handleError);
  server.setNotFoundHandler({ preHandler: server.rateLimit() }, ErrorHandlers.handleNotFoundError);

  server.get("/healthz", async (_: FastifyRequest) => {
    return { status: getReasonPhrase(StatusCodes.OK) };
  });

  server.register(routes, { prefix: `/api/${config.get("server.api.version")}` });

  server.listen({ port: config.get("server.port") }, (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Server listening at ${address}`);
  });
});

async function registerServerPlugins(server: FastifyInstance) {
  await server.register(swagger, swaggerConfig);
  await server.register(scalar, swaggerScalarConfig);
  await server.register(cookie, cookieConfig);
  await server.register(limiter, rateLimiterConfig);
  await server.register(fastifyBcrypt, bcryptSaltConfig);
  await server.register(authenticate);
  await server.register(cors, corsConfig);
  await server.register(db);
}
