import type { FastifyInstance } from "fastify";

import { clerkPlugin } from "@clerk/fastify";
import cors from "@fastify/cors";
import mutipart from "@fastify/multipart";
import limiter from "@fastify/rate-limit";
import swagger from "@fastify/swagger";
import scalar from "@scalar/fastify-api-reference";
import { fastifyBcrypt } from "fastify-bcrypt";
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";

import { env } from "@/env";
import { swaggerConfig, swaggerScalarConfig } from "@/open-api";
import authenticate from "@/plugins/authenticate";
import { corsConfig, rateLimiterConfig } from "@/utils/http";

import { ErrorHandlers } from "./handlers/error/error-handlers";
import database from "./plugins/db";
import cache from "./plugins/redis-cache";
import { bcryptSaltConfig } from "./utils/jwt";

export async function bootstrapServerPlugins(server: FastifyInstance) {
  try {
    await server.register(swagger, swaggerConfig);
    await server.register(scalar, swaggerScalarConfig);
    await server.register(authenticate);
    await server.register(mutipart);
    await server.register(cache);
    await server.register(database);
    await server.register(limiter, { redis: server.cache, ...rateLimiterConfig });
    await server.register(fastifyBcrypt, bcryptSaltConfig);
    await server.register(cors, corsConfig);
    await server.register(clerkPlugin);

    setJsonSchemaSerdes(server);
    setErrorHandlers(server);
  }
  catch (err) {
    console.error(err);
    process.exit(1);
  }
}

function setJsonSchemaSerdes(server: FastifyInstance) {
  server.setValidatorCompiler(validatorCompiler);
  server.setSerializerCompiler(serializerCompiler);
}

function setErrorHandlers(server: FastifyInstance) {
  server.setErrorHandler(ErrorHandlers.handleError);
  server.setNotFoundHandler({ preHandler: server.rateLimit() }, ErrorHandlers.handleNotFoundError);
}
