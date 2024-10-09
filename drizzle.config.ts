import { defineConfig } from "drizzle-kit";

import { env } from "./src/env.js";

const dbBasePath = "./src/db/";

// https://orm.drizzle.team/docs/migrations
export default defineConfig({
  schema: `${dbBasePath}schema.ts`,
  out: `${dbBasePath}migrations`,
  dialect: "postgresql",
  dbCredentials: {
    host: env.DB_HOST || "localhost",
    user: env.DB_USER || "postgres",
    password: env.DB_PASSWORD || "postgres",
    database: env.DB_NAME || "postgres",
  },
});
