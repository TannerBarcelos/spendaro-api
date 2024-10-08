import type { FastifyPluginCallback } from "fastify";

import { drizzle } from "drizzle-orm/postgres-js";
import fp from "fastify-plugin";
import postgres from "postgres";

import * as relations from "./relations";
import * as schema from "./schema";

const postgresConnector: FastifyPluginCallback = async (fastify, _) => {
  try {
    const databaseUrl
      = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:5432/${process.env.DB_NAME}`
      || "postgresql://postgres@localhost:5432/postgres";

    if (!databaseUrl) {
      throw new Error("DATABASE_URL must be set to connect to the database");
    }

    // Create a postgres client and a drizzle instance (from docs https://arc.net/l/quote/poktxass)
    const client = postgres(databaseUrl);
    const db = drizzle(client, {
      schema: { ...schema, ...relations },
    });

    // Decorate the fastify instance with the database object so we can access it on the fastify instance
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
