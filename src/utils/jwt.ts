import type { FastifyRequest } from "fastify";

import config from "config";

export function generateAccessToken(request: FastifyRequest, payload: number): string {
  return request.server.jwt.sign({
    user_id: payload,
  }, { expiresIn: config.get<string>("security.jwt.expires_in") ?? "15m" });
}
