/* eslint-disable node/no-process-env */
import type { FastifyInstance, FastifyPluginCallback } from "fastify";

import { drizzle } from "drizzle-orm/postgres-js";
import fp from "fastify-plugin";
import postgres from "postgres";

import * as schema from "./schema";

const {
  DB_USER = "postgres",
  DB_PASSWORD = "",
  DB_HOST = "localhost",
  DB_PORT = 5432,
  DB_NAME = "postgres",
} = process.env;

const databaseUrl
  = `postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`
  || "postgresql://postgres@localhost:5432/postgres";

if (!databaseUrl) {
  throw new Error("DATABASE_URL must be set to connect to the database");
}

// Create a postgres client and a drizzle instance (from docs https://arc.net/l/quote/poktxass)
const client = postgres(databaseUrl);
export const db = drizzle(client, {
  schema: { ...schema },
});

const postgresConnector: FastifyPluginCallback = async (fastify: FastifyInstance) => {
  try {
    fastify.decorate<typeof db>("db", db);
    console.log("Connected to the database");
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
