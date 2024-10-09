/* eslint-disable ts/consistent-type-imports */
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";

import "fastify";

import * as schema from "./src/db/schema.ts";

declare module "fastify" {
  interface FastifyInstance {
    db: PostgresJsDatabase<typeof schema>;
    authenticate: (
      request: FastifyRequest,
      reply: FastifyReply
    ) => Promise<void>;
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
