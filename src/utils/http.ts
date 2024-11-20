import type { FastifyCorsOptions } from "@fastify/cors";
import type { RateLimitPluginOptions } from "@fastify/rate-limit";

import { createClerkClient } from "@clerk/backend";
import config from "config";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";

import { env } from "@/env";

import { TooManyRequestError } from "./error";

export const clerkClient = createClerkClient({ secretKey: env.CLERK_SECRET_KEY });

export const ALLOWED_METHODS = ["GET", "POST", "PUT", "DELETE"];
export const STATUS_CODES = StatusCodes;

// Represents the common HTTP response schema for all responses when the request is successful (will be extended by other schemas)
export const commonHttpResponseSchema = z.object({
  data: z.any().optional(),
  message: z.string(),
});

const allowedOrigins = [
  "http://localhost:5173", // Local development
  "https://your-production-domain.com", // Production
  "https://your-staging-domain.com", // Staging
];

export const corsConfig: FastifyCorsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true); // Allow requests with matching origin
    }
    else {
      callback(new Error("Not allowed by CORS"), false);
    }
  },
  methods: ALLOWED_METHODS,
};

export const rateLimiterConfig: RateLimitPluginOptions = {
  global: config.get("server.rate_limit.global") ?? false,
  max: config.get("server.rate_limit.max") ?? 3,
  timeWindow: config.get("server.rate_limit.time_window") ?? 10_000,
  allowList: config.get<Array<string>>("server.rate_limit.allow_list") ?? [],
  keyGenerator: request => request.user?.id ?? request.ip, // Rate limit by user ID if authenticated, otherwise by IP
  errorResponseBuilder(_, context) {
    return new TooManyRequestError(`Uh-oh! The rate limit was exceeded. A maximum of ${context.max} requests per ${context.after} is allowed. Try again soon.`);
  },
};
