/* eslint-disable no-console */
/* eslint-disable node/no-process-env */
import dotenv from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

import * as schema from "./schema";

dotenv.config();
const {
  DB_USER = "postgres",
  DB_PASSWORD = "",
  DB_HOST = "localhost",
  DB_PORT = 5432,
  DB_NAME = "postgres",
} = process.env;

// Construct database URL, handling case without password
const databaseUrl = DB_PASSWORD.length > 0
  ? `postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`
  : `postgresql://${DB_USER}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;

if (!databaseUrl) {
  throw new Error("DATABASE_URL must be set to connect to the database");
}

const client = postgres(databaseUrl);
const db = drizzle(client, {
  schema: { ...schema },
});

async function main() {
  console.log("Migration started");
  try {
    await migrate(db, {
      migrationsFolder: "./src/db/migrations",
    });
    console.log("Migration completed successfully");
  }
  catch (error) {
    console.error("Migration failed:", error);
    throw error;
  }
  finally {
    await client.end();
    console.log("Database connection closed");
  }
}

main()
  .then(() => {
    console.log("Migration process finished");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Migration process failed:", err);
    process.exit(1);
  });
