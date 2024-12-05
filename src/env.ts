import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    // Node environment
    NODE_ENV: z.string().default("development"),

    // Postgres database
    DB_HOST: z.string(),
    DB_PORT: z.coerce.number(), // .env vars are always strings, so we need to coerce them to numbers
    DB_USER: z.string(),
    DB_PASSWORD: z.string(),
    DB_NAME: z.string(),

    // Clerk
    CLERK_PUBLISHABLE_KEY: z.string(),
    CLERK_SECRET_KEY: z.string(),
    CLERK_WEBHOOK_CREATED_USER_KEY: z.string(),
    CLERK_WEBHOOK_DELETED_USER_KEY: z.string(),

    // redis cache
    REDIS_PASSWORD: z.string(),
    REDIS_HOST: z.string(),
    REDIS_PORT: z.coerce.number(),
    REDIS_DB: z.string(),
  },
  runtimeEnv: process.env,
});
