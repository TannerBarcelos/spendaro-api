import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

import type { TUserToCreate } from "@/handlers/budget/budget-schemas";

import { users } from "@/db/schema";

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
        request.log.info("User created webhook received. Creating new user with basic info");
        const { id, first_name, last_name, image_url } = request.body.data;
        const newUser: TUserToCreate = {
          user_id: id,
          firstName: first_name,
          lastName: last_name,
          profileImage: image_url,
        };
        await fastify.db.insert(users).values(newUser).execute();
        request.log.info(`User created webhook processed successfully. User with id ${newUser.user_id} created`);
        reply.send("ok");
      },
    });
}
