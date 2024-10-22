import type { JWT } from "@fastify/jwt";

import config from "config";

/**
 * Generate a signed JWT token
 * @param jwt - JWT instance
 * @param payload - Payload to be signed
 * @returns - Signed JWT token
 */
export function generateAccessToken(jwt: JWT, user_id: number): string {
  const expiry = config.get<string>("security.jwt.expiry") ?? "15m";
  return jwt.sign({
    user_id,
  }, { expiresIn: expiry });
}

/**
 * Generate a signed refresh token
 * @param jwt  - JWT instance
 * @param user_id  - User ID
 * @returns  - Signed refresh token
 */
export function generateRefreshToken(jwt: JWT, user_id: number): string {
  return jwt.sign({
    user_id,
  }, { expiresIn: config.get<string>("security.jwt.refresh_expiry") ?? "7d" });
}

export const bcryptSaltConfig = {
  saltWorkFactor: config.get<number>("security.jwt.salt_rounds") ?? 10,
};
