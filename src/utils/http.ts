import type { RateLimitPluginOptions } from "@fastify/rate-limit";

import config from "config";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";

import { TooManyRequestError } from "./error";

export const ALLOWED_METHODS = ["GET", "POST", "PUT", "DELETE"];
export const STATUS_CODES = StatusCodes;

// Represents the common HTTP response schema for all responses when the request is successful (will be extended by other schemas)
export const commonHttpResponseSchema = z.object({
  data: z.any().optional(),
  message: z.string(),
});

export const corsConfig = {
  origin: "*",
  methods: ALLOWED_METHODS,
};

export const rateLimiterConfig: RateLimitPluginOptions = {
  global: config.get("server.rate_limit.global") ?? false,
  max: config.get("server.rate_limit.max") ?? 3,
  timeWindow: config.get("server.rate_limit.time_window") ?? 10_000,
  allowList: config.get<Array<string>>("server.rate_limit.allow_list") ?? [],
  keyGenerator: request => request.user?.user_id ?? request.ip, // Rate limit by user ID if authenticated, otherwise by IP
  errorResponseBuilder(_, context) {
    return new TooManyRequestError(`Uh-oh! The rate limit was exceeded. A maximum of ${context.max} requests per ${context.after} is allowed. Try again soon.`);
  },
};
