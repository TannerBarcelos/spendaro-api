import type { FastifyCookieOptions } from "@fastify/cookie";
import type { RateLimitPluginOptions } from "@fastify/rate-limit";

import config from "config";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";

import { env } from "@/env";

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

// 3 requests every 10 seconds
export const rateLimiterConfig: RateLimitPluginOptions = {
  global: config.get("server.rate_limit.global") || false,
  max: config.get("server.rate_limit.max") || 3,
  timeWindow: config.get("server.rate_limit.time_window") || 10_000,
  allowList: config.get("server.rate_limit.whitelist"), // Allowlist localhost and Docker container IP
};
