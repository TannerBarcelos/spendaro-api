import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import {
  users,
  budget_categories,
  budget_category_item_transaction_types,
  budget_category_item_transactions,
  budget_category_items,
  budgets,
} from './schema';

const postgresConnector: FastifyPluginCallback = (fastify, _, done) => {
  const databaseUrl =
    `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:5432/${process.env.DB_NAME}` ||
    'postgresql://postgres@localhost:5432/postgres';

  if (!databaseUrl) {
    throw new Error('DATABASE_URL must be set to connect to the database');
  }

  // Create a postgres client and a drizzle instance (from docs https://arc.net/l/quote/poktxass)
  const client = postgres(databaseUrl);
  const db = drizzle(client, {
    schema: {
      users,
      budgets,
      budget_categories,
      budget_category_items,
      budget_category_item_transactions,
      budget_category_item_transaction_types,
    },
  });

  // Decorate the fastify instance with the database object so we can access it on the fastify instance
  fastify.decorate<typeof db>('db', db);

  console.log('Connected to the database');

  // Run migrations, if not in production
  if (process.env.NODE_ENV !== 'production') {
    console.log(`Running migrations against ${databaseUrl}`);
    migrate(db, {
      migrationsFolder: './src/db/migrations',
    });
  }

  // Close the database connection when the server closes
  fastify.addHook('onClose', async () => {
    await client.end();
  });

  done();
};

export default fp(postgresConnector);
