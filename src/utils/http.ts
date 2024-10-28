import type { FastifyCookieOptions } from "@fastify/cookie";
import type { RateLimitPluginOptions } from "@fastify/rate-limit";

import config from "config";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";

import { env } from "@/env";

import { TooManyRequestError } from "./error";

export const ALLOWED_METHODS = ["GET", "POST", "PUT", "DELETE"];
export const STATUS_CODES = StatusCodes;

// Represents the common HTTP response schema for all responses when the request is successful (will be extended by other schemas)
export const commonHttpResponseSchema = z.object({
  data: z.any().optional(),
  message: z.string(),
});

export const cookieConfig: FastifyCookieOptions = {
  secret: env.COOKIE_SECRET,
  parseOptions: {
    httpOnly: env.NODE_ENV === "production",
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 15 * 60 * 1000, // 15 minutes (matches the access token expiry)
    path: "/",
  },
};

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
    // return {
    //   statusCode: StatusCodes.TOO_MANY_REQUESTS,
    //   error: getReasonPhrase(StatusCodes.TOO_MANY_REQUESTS),
    //   message: `Uh-oh! The rate limit was exceeded. A maximum of ${context.max} requests per ${context.after} is allowed. Try again soon.`,
    //   date: Date.now(),
    //   expiresIn: context.ttl,
    // };
    return new TooManyRequestError(`Uh-oh! The rate limit was exceeded. A maximum of ${context.max} requests per ${context.after} is allowed. Try again soon.`);
  },
};
