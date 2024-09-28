import 'fastify';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

declare module 'fastify' {
  interface FastifyInstance {
    db: PostgresJsDatabase,
  }
  interface FastifyRequest {
    user: string
  }
}

declare namespace NodeJS {
  interface ProcessEnv {
    DATABASE_URL: string;
    NODE_ENV: 'development' | 'production';
    DB_HOST: string;
    DB_USER: string;
    DB_PASSWORD: string;
    DB_NAME: string;
  }
}
