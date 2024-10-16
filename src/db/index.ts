import type { FastifyInstance, FastifyPluginCallback } from "fastify";

import { drizzle } from "drizzle-orm/postgres-js";
import fp from "fastify-plugin";
import postgres from "postgres";

import { env } from "@/env";

import * as schema from "./schema";

const postgresConnector: FastifyPluginCallback = async (fastify: FastifyInstance) => {
  try {
    const databaseUrl
      = `postgresql://${env.DB_USER}:${env.DB_PASSWORD}@${env.DB_HOST}:${env.DB_PORT}/${env.DB_NAME}`
      || "postgresql://postgres@localhost:5432/postgres";

    if (!databaseUrl) {
      throw new Error("DATABASE_URL must be set to connect to the database");
    }

    // Create a postgres client and a drizzle instance (from docs https://arc.net/l/quote/poktxass)
    const client = postgres(databaseUrl);
    const db = drizzle(client, {
      schema: { ...schema },
    });

    // Decorate the fastify instance with the database object so we can access it on the fastify instance in our repositories
    fastify.decorate<typeof db>("db", db);

    console.log("Connected to the database");

    // Close the database connection when the server closes
    // No need to put in .finally block as fastify will handle this for us
    fastify.addHook("onClose", async () => {
      await client.end();
    });
  }
  catch (error) {
    console.error("Error connecting to the database", error);
    process.exit(1);
  }
};

export default fp(postgresConnector);
