import type { WebhookEvent } from "@clerk/fastify";
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

import { Webhook } from "svix";
import { z } from "zod";

import type { TUserToCreate } from "@/handlers/budget/budget-schemas";

import { users } from "@/db/schema";
import { env } from "@/env";
import { SpendaroError } from "@/utils/error";

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
        body: z.string(), // serialized JSON string over the wire coming from Clerk
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

        // security check - ensure the webhook is from Clerk by headers sent against the webhook secret which was used to initially sign the webhook
        try {
          userCreatedEvent = wh.verify(request.body, {
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

        const eventType = userCreatedEvent.type;

        request.log.info(`Received webhook with ID ${userCreatedEvent.data} and event type of ${eventType}`);

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
