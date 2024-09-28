import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';

const postgresConnector: FastifyPluginCallback = (fastify, _, done) => {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error('DATABASE_URL must be set to connect to the database');
  }

  // Create a postgres client and a drizzle instance (from docs https://arc.net/l/quote/poktxass)
  const client = postgres(databaseUrl);
  const db = drizzle(client);

  // Decorate the fastify instance with the database object so we can access it on the fastify instance
  fastify.decorate('db', db);

  console.log('Connected to the database');

  // Close the database connection when the server closes
  fastify.addHook('onClose', async () => {
    await client.end();
  });

  done()
}

export default fp(postgresConnector);
