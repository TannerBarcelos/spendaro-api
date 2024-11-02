/* eslint-disable ts/consistent-type-imports */
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";

import "fastify";
import Redis from "ioredis";

import * as schema from "./src/db/schema.ts";

// declaration merging - add properties to existing types for Fastify
declare module "fastify" {
  interface FastifyInstance {
    db: PostgresJsDatabase<typeof schema>;
    authenticate: (
      request: FastifyRequest,
      reply: FastifyReply
    ) => Promise<void>;
    cache: Redis;
  }
}

// declaration merging - add properties to existing types for JWT
declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: {
      user_id: number;
    };
    user: {
      user_id: number;
    };
  }
}
