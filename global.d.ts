/* eslint-disable ts/consistent-type-imports */
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";

import { User } from "@clerk/fastify";
import "fastify";
import Redis from "ioredis";

import * as schema from "./src/db/schema.ts";

// declaration merging - add properties to existing types for Fastify
declare module "fastify" {
  interface FastifyRequest {
    user: User;
  }
  interface FastifyInstance {
    db: PostgresJsDatabase<typeof schema>;
    authenticate: (
      request: FastifyRequest,
      reply: FastifyReply
    ) => Promise<void>;
    cache: Redis;
  }
}
