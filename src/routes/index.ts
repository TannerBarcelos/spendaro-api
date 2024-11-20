import type { FastifyInstance } from "fastify";

import { v1 } from "./v1";

export async function routes(server: FastifyInstance) {
  await server.register(v1, { prefix: "/api/v1" });
  // Add more versions here i.e.
  // await server.register(v2, { prefix: "/api/v2" });
}
