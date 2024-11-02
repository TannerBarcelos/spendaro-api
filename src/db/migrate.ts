/* eslint-disable no-console */

import { migrate } from "drizzle-orm/postgres-js/migrator";

import { env as dbCredentials } from "@/env";

import { client, db } from ".";

console.log("Database configuration for migration:");
console.table(dbCredentials);

// Construct database URL, handling case without password
const databaseUrl = dbCredentials.DB_PASSWORD.length > 0
  ? `postgresql://${dbCredentials.DB_USER}:${dbCredentials.DB_PASSWORD}@${dbCredentials.DB_HOST}:${dbCredentials.DB_PORT}/${dbCredentials.DB_NAME}`
  : `postgresql://${dbCredentials.DB_USER}@${dbCredentials.DB_HOST}:${dbCredentials.DB_PORT}/${dbCredentials.DB_NAME}`;

if (!databaseUrl) {
  throw new Error("DATABASE_URL must be set to connect to the database");
}

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
