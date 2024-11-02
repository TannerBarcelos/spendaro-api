import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { env as dbCredentials } from "@/env";

import * as schema from "./schema";

const databaseUrl
  = `postgresql://${dbCredentials.DB_USER}:${dbCredentials.DB_PASSWORD}@${dbCredentials.DB_HOST}:${dbCredentials.DB_PORT}/${dbCredentials.DB_NAME}`
  || "postgresql://postgres@localhost:5432/postgres";

if (!databaseUrl) {
  throw new Error("DATABASE_URL must be set to connect to the database");
}

export const client = postgres(databaseUrl);
export const db = drizzle(client, {
  schema: { ...schema },
});
