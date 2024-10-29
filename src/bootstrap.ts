import type { FastifyInstance } from "fastify";

import cookie from "@fastify/cookie";
import cors from "@fastify/cors";
import fastifyEnv from "@fastify/env";
import jwt from "@fastify/jwt";
import mutipart from "@fastify/multipart";
import limiter from "@fastify/rate-limit";
import swagger from "@fastify/swagger";
import scalar from "@scalar/fastify-api-reference";
import { fastifyBcrypt } from "fastify-bcrypt";
import { createRouteHandler } from "uploadthing/fastify";
import { zodToJsonSchema } from "zod-to-json-schema";

import db from "@/db/index";
import { swaggerConfig, swaggerScalarConfig } from "@/open-api";
import authenticate from "@/plugins/authenticate";
import { corsConfig, rateLimiterConfig, registerCookieConfig } from "@/utils/http";

import { env } from "./env";
import cache from "./plugins/redis-cache";
import { uploadRouter } from "./routes/uploadthing";
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
      cookie: {
        cookieName: "accessToken", // will look for a cookie named "accessToken" to get the JWT from (instead of the Authorization header)
        signed: false,
      },
    });
    await server.register(swagger, swaggerConfig);
    await server.register(scalar, swaggerScalarConfig);
    await server.register(authenticate);
    await server.register(mutipart);
    await server.register(cache);
    await server.register(db);
    await server.register(cookie, registerCookieConfig(server));
    await server.register(limiter, { redis: server.cache, ...rateLimiterConfig });
    await server.register(fastifyBcrypt, bcryptSaltConfig);
    await server.register(cors, corsConfig);
    await server.register(createRouteHandler, {
      router: uploadRouter,
    });
  }
  catch (err) {
    console.error(err);
    process.exit(1);
  }
}
