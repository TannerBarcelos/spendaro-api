import type { FastifyInstance } from "fastify";

import { userCreated } from "./user-created";

export async function clerkWebhooks(fastify: FastifyInstance) {
  fastify.get("/user-created", userCreated);
}
