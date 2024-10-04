import 'fastify';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from './src/db/schema';
import * as relations from './src/db/relations';
import { AuthService } from '@/services/auth-service';

type MergedSchema = schema.SchemaType & relations.RelationsType;

declare module 'fastify' {
  interface FastifyInstance {
    db: PostgresJsDatabase<MergedSchema>;
    authenticate: (
      request: FastifyRequest,
      reply: FastifyReply
    ) => Promise<void>;
  }
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    // the type of the payload to be signed or verified
    payload: {
      user_id: number;
      email: string;
      first_name: string;
      last_name: string;
    };

    // the type of the decoded payload that will be available in the request via the fastify/jwt plugin
    user: {
      user_id: number;
      email: string;
      first_name: string;
      last_name: string;
    };
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
    JWT_SECRET: string;
  }
}
