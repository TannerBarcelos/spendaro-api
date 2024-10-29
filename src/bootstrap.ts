import type { FastifyInstance } from "fastify";

import cors from "@fastify/cors";
import fastifyEnv from "@fastify/env";
import jwt from "@fastify/jwt";
import mutipart from "@fastify/multipart";
import limiter from "@fastify/rate-limit";
import swagger from "@fastify/swagger";
import scalar from "@scalar/fastify-api-reference";
import { fastifyBcrypt } from "fastify-bcrypt";
import { zodToJsonSchema } from "zod-to-json-schema";

import db from "@/db/index";
import { swaggerConfig, swaggerScalarConfig } from "@/open-api";
import authenticate from "@/plugins/authenticate";
import { corsConfig, rateLimiterConfig } from "@/utils/http";

import { env } from "./env";
import cache from "./plugins/redis-cache";
import { bcryptSaltConfig } from "./utils/jwt";

export async function bootstrapServerPlugins(server: FastifyInstance) {
  try {
    await server.register(fastifyEnv, {
      dotenv: true,
      schema: zodToJsonSchema(env),
      confKey: "env", // used as the key to access the environment variables on the server instance - typed in the types.d.ts file - the name in the types.d.ts file should match the key here
    });
    await server.register(jwt, {
      secret: server.env.JWT_SECRET,
    });
    await server.register(swagger, swaggerConfig);
    await server.register(scalar, swaggerScalarConfig);
    await server.register(authenticate);
    await server.register(mutipart);
    await server.register(cache);
    await server.register(db);
    await server.register(limiter, { redis: server.cache, ...rateLimiterConfig });
    await server.register(fastifyBcrypt, bcryptSaltConfig);
    await server.register(cors, corsConfig);
  }
  catch (err) {
    console.error(err);
    process.exit(1);
  }
}
