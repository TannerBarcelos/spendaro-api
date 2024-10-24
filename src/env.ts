import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    NODE_ENV: z.string().default("development"),
    DB_HOST: z.string().default("localhost"),
    DB_PORT: z.string().default("5432"),
    DB_USER: z.string().default("postgres"),
    DB_PASSWORD: z.string().default(""),
    DB_NAME: z.string().default("postgres"),
    JWT_SECRET: z.string().default("supersecret"),
    COOKIE_SECRET: z.string().default("supersecret"),
  },
  // eslint-disable-next-line node/no-process-env
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});
