import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";

import "fastify";

import type * as relations from "./src/db/schema/relations.ts";
import type * as schema from "./src/db/schema.ts";

type MergedSchema = typeof schema & typeof relations;

declare module "fastify" {
  interface FastifyInstance {
    db: PostgresJsDatabase<MergedSchema>;
    authenticate: (
      request: FastifyRequest,
      reply: FastifyReply
    ) => Promise<void>;
  }
}

declare module "@fastify/jwt" {
  interface FastifyJWT {
    // the type of the payload to be signed
    payload: {
      user_id: number;
    };

    // the type of the decoded payload that will be available in the request via the fastify/jwt plugin
    user: {
      user_id: number;
    };
  }
}

declare namespace NodeJS {
  interface ProcessEnv {
    DATABASE_URL: string;
    NODE_ENV: "development" | "production";
    DB_HOST: string;
    DB_USER: string;
    DB_PASSWORD: string;
    DB_NAME: string;
    JWT_SECRET: string;
  }
}
