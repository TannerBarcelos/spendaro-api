/* eslint-disable no-console */

import { migrate } from "drizzle-orm/postgres-js/migrator";

import { client, db } from ".";

console.log("Database configuration for migration:");

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
