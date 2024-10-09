import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

import { env } from "../env.js";
import * as schema from "./schema.js";

const databaseUrl = `postgresql://${env.DB_USER}:${env.DB_PASSWORD}@${env.DB_HOST}:${env.DB_PORT}/${env.DB_NAME}`;

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
