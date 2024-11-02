import { createEnv } from "@t3-oss/env-core";
import dotenv from "dotenv";
import { z } from "zod";

// load .env file into process.env - leverage t3-env to validate the env vars and make them available
dotenv.config();

export const env = createEnv({
  server: {
    NODE_ENV: z.string().default("development"),
    DB_HOST: z.string(),
    DB_PORT: z.coerce.number(), // .env vars are always strings, so we need to coerce them to numbers
    DB_USER: z.string(),
    DB_PASSWORD: z.string(),
    DB_NAME: z.string(),
    JWT_SECRET: z.string(),
    UPLOADTHING_TOKEN: z.string(),
  },
  runtimeEnv: process.env,
});
