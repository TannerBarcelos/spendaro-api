import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: { NODE_ENV: z.string(), DB_HOST: z.string(), DB_PORT: z.number(), DB_USER: z.string(), DB_PASSWORD: z.string(), DB_NAME: z.string(), JWT_SECRET: z.string(), UPLOADTHING_TOKEN: z.string() },
  runtimeEnv: process.env,
});
