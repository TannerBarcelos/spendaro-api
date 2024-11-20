import type { WebhookEvent } from "@clerk/fastify";
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

import { Webhook } from "svix";
import { z } from "zod";

import type { TUserToCreate } from "@/handlers/budget/budget-schemas";

import { users } from "@/db/schema";
import { env } from "@/env";
import { SpendaroError } from "@/utils/error";

const HTTPRequestSchema = z.object({
  client_ip: z.string(),
  user_agent: z.string(),
});

const EventAttributesSchema = z.object({
  http_request: HTTPRequestSchema,
});

const DataSchema = z.object({
  first_name: z.string(),
  id: z.string(),
  last_name: z.string(),
  image_url: z.string(),
});

export const UserCreatedClerkPayloadSchema = z.object({
  data: DataSchema,
  event_attributes: EventAttributesSchema,
  object: z.string(),
  timestamp: z.number(),
  type: z.string(),
});

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
        headers: z.object({
          "svix-id": z.string(),
          "svix-timestamp": z.string(),
          "svix-signature": z.string(),
        }),
      },
      handler: async (request, reply) => {
        request.log.info("User created webhook received. Creating new user with basic info");

        const wh = new Webhook(env.CLERK_USER_CREATED_WEBHOOK_SECRET);

        const headers = request.headers;
        const svix_id = headers["svix-id"];
        const svix_timestamp = headers["svix-timestamp"];
        const svix_signature = headers["svix-signature"];

        if (!svix_id || !svix_timestamp || !svix_signature) {
          throw new SpendaroError("Error: Missing headers", 400, ["Missing required headers to process user.created webhook event"]);
        }

        let userCreatedEvent: WebhookEvent;
        const payload = JSON.stringify(request.body);

        try {
          userCreatedEvent = wh.verify(payload, {
            "svix-id": svix_id,
            "svix-timestamp": svix_timestamp,
            "svix-signature": svix_signature,
          }) as WebhookEvent;
        }
        catch (err) {
          console.error("Error: Could not verify webhook:", err);
          return new Response("Error: Verification error", {
            status: 400,
          });
        }

        const { id } = userCreatedEvent.data;
        const eventType = userCreatedEvent.type;

        request.log.info(`Received webhook with ID ${id} and event type of ${eventType}`);

        if (userCreatedEvent.type === "user.created") {
          const userData = userCreatedEvent.data;
          const newUser: TUserToCreate = {
            user_id: userData.id,
          };
          await fastify.db.insert(users).values(newUser);
          request.log.info(`User created webhook processed successfully. User with id ${newUser.user_id} created`);
        }
        reply.send({ message: "User created webhook processed successfully" });
      },
    });
}
