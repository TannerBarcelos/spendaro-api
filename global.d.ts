import 'fastify';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import type {
  users,
  budget_categories,
  budget_category_item_transaction_types,
  budget_category_item_transactions,
  budget_category_items,
  budgets,
} from './schema';
import { SpendaroSchema } from './src/db/schema';
import { AuthService } from '@/services/auth-service';

declare module 'fastify' {
  interface FastifyInstance {
    db: PostgresJsDatabase<SpendaroSchema>;
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
  interface FastifyRequest {
    user: string;
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
