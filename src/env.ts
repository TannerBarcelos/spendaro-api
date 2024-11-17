import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    NODE_ENV: z.string().default("development"),
    DB_HOST: z.string(),
    DB_PORT: z.coerce.number(), // .env vars are always strings, so we need to coerce them to numbers
    DB_USER: z.string(),
    DB_PASSWORD: z.string(),
    DB_NAME: z.string(),
    UPLOADTHING_TOKEN: z.string(),
    CLERK_PUBLISHABLE_KEY: z.string(),
    CLERK_SECRET_KEY: z.string(),
  },
  runtimeEnv: process.env,
});
