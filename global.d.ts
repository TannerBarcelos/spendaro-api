/* eslint-disable ts/consistent-type-imports */
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";

import "fastify";
import Redis from "ioredis";

import * as schema from "./src/db/schema.ts";

namespace NodeJS {
  interface ProcessEnv {
    DB_USER: string;
    DB_PASSWORD: string;
    DB_HOST: string;
    DB_PORT: string;
    DB_NAME: string;
    JWT_SECRET: string;
    COOKIE_SECRET: string;
    UPLOADTHING_TOKEN: string;
  }
}

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

declare module "@fastify/jwt" {
  interface FastifyJWT {
    // the type of the payload to be signed (jwt.sign will only accept an object of this type)
    payload: {
      user_id: number;
    };

    // the type of the decoded payload that will be available in the request via the fastify/jwt plugin
    user: {
      user_id: number;
    };
  }
}
