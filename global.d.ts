import 'fastify';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

declare module 'fastify' {
  interface FastifyInstance {
    db: PostgresJsDatabase
  }
}

declare namespace NodeJS {
  interface ProcessEnv {
    DATABASE_URL: string;
  }
}
