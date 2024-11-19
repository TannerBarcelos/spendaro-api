import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

import { UserCreatedClerkPayloadSchema } from "./user-created";

// clerk webhooks - full OpenAPI schema and implementation (types also inferred so type-safe code)
export async function clerkWebhooks(fastify: FastifyInstance) {
  fastify
    .withTypeProvider<ZodTypeProvider>()
    .route({
      method: "POST",
      url: "/user-created",
      schema: {
        summary: "Handle user created webhook from Clerk",
        tags: ["webhooks"],
        body: UserCreatedClerkPayloadSchema,
      },
      handler: async (request, reply) => {
        request.log.info("webhook called: user-create. Creating new user with data: ");
        console.log(request.body.data);
        reply.send("ok");
      },
    });
}
