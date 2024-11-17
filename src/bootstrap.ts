import type { FastifyInstance } from "fastify";

import { clerkPlugin } from "@clerk/fastify";
import cors from "@fastify/cors";
import mutipart from "@fastify/multipart";
import limiter from "@fastify/rate-limit";
import swagger from "@fastify/swagger";
import scalar from "@scalar/fastify-api-reference";
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";

import { swaggerConfig, swaggerScalarConfig } from "@/open-api";
import { corsConfig, rateLimiterConfig } from "@/utils/http";

import { ErrorHandlers } from "./handlers/error/error-handlers";
import database from "./plugins/db";
import cache from "./plugins/redis-cache";

export async function bootstrapServerPlugins(server: FastifyInstance) {
  try {
    await server.register(clerkPlugin);
    await server.register(swagger, swaggerConfig);
    await server.register(scalar, swaggerScalarConfig);
    await server.register(mutipart);
    await server.register(cache);
    await server.register(database);
    await server.register(limiter, { redis: server.cache, ...rateLimiterConfig });
    await server.register(cors, corsConfig);

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
