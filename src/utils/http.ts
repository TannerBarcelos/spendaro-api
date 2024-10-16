import type { FastifyCookieOptions } from "@fastify/cookie";

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
