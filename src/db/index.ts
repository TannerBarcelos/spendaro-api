import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';

const myPluginCallback: FastifyPluginCallback = (fastify, _, done) => {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error('DATABASE_URL must be set to connect to the database');
  }

  // Create a postgres client and a drizzle instance (from docs https://arc.net/l/quote/poktxass)
  const client = postgres(connectionString);
  const db = drizzle(client);

  // Decorate the fastify instance with the database object so we can access it in our routes
  fastify.decorate('db', db);

  console.log('Connected to the database');

  // Close the database connection when the server closes
  fastify.addHook('onClose', async () => {
    await client.end();
  });

  done()
}

export default fp(myPluginCallback);
