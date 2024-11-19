import type { FastifyInstance } from "fastify";

import { clerkWebhooks } from "./clerk";

// /api/webhooks/user-created
export async function webhooks(instance: FastifyInstance) {
  const commonPrefix = "/api/webhooks";
  await instance.register(clerkWebhooks, { prefix: commonPrefix });
}
