import { defineConfig } from "drizzle-kit";

import { env } from "./src/env.ts";

// https://orm.drizzle.team/docs/migrations
export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./src/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    host: env.DB_HOST,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
  },
});
