import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { env } from "@/env";

import * as schema from "./schema";

const databaseUrl
  = `postgresql://${env.DB_USER}:${env.DB_PASSWORD}@${env.DB_HOST}:${env.DB_PORT}/${env.DB_NAME}`
  || "postgresql://postgres@localhost:5432/postgres";

// Connect to the database
export const client = postgres(databaseUrl, {
  prepare: false,
  ssl: process.env.NODE_ENV === "production",
  connection: {
    application_name: "spendaro",
  },
});

// Create a Drizzle instance using the database client
export const db = drizzle(client, {
  schema: { ...schema },
});
