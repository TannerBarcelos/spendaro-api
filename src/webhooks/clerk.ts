import type { WebhookEvent } from "@clerk/fastify";
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

import { clerkClient } from "@clerk/clerk-sdk-node";
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
      },
      handler: async (request, reply) => {
        request.log.info("User created webhook received. Creating new user with basic info");

        const wh = new Webhook(env.CLERK_WEBHOOK_CREATED_USER_KEY);

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
          userCreatedEvent = wh.verify(JSON.stringify(request.body), {
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

        request.log.info(`Received webhook with ID ${userCreatedEvent.data.id} and event type of ${eventType}`);

        if (userCreatedEvent.type === "user.created") {
          const userData = userCreatedEvent.data;
          const newUser: TUserToCreate = {
            user_id: userData.id,
          };
          await fastify.db.insert(users).values(newUser);

          request.log.info("Settings up user metadata with Clerk");
          // use the clerk client to update the users metadata with isOnboarded set to false
          await clerkClient.users.updateUserMetadata(newUser.user_id, {
            publicMetadata: {
              isOnboarded: false, // users are not onboarded by default
            },
          });

          request.log.info(`User created webhook processed successfully. User with id ${newUser.user_id} created`);
        }
        reply.send({ message: "User created webhook processed successfully" });
      },
    });

  fastify
    .withTypeProvider<ZodTypeProvider>()
    .route({
      method: "POST",
      url: "/user-deleted",
      schema: {
        summary: "Handle user deleted webhook from Clerk",
        tags: ["webhooks"],
        headers: z.object({
          "svix-id": z.string(),
          "svix-timestamp": z.string(),
          "svix-signature": z.string(),
        }),
      },
      handler: async (request, reply) => {
        request.log.info("User deleted webhook received. Deleting user now.");

        const wh = new Webhook(env.CLERK_WEBHOOK_DELETED_USER_KEY);

        const headers = request.headers;
        const svix_id = headers["svix-id"];
        const svix_timestamp = headers["svix-timestamp"];
        const svix_signature = headers["svix-signature"];

        if (!svix_id || !svix_timestamp || !svix_signature) {
          throw new SpendaroError("Error: Missing headers", 400, ["Missing required headers to process user.created webhook event"]);
        }

        let userDeletedEvent: WebhookEvent;

        // security check - ensure the webhook is from Clerk by headers sent against the webhook secret which was used to initially sign the webhook
        try {
          userDeletedEvent = wh.verify(JSON.stringify(request.body), {
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

        const eventType = userDeletedEvent.type;

        request.log.info(`Received webhook with ID ${userDeletedEvent.data.id} and event type of ${eventType}`);

        if (userDeletedEvent.type === "user.deleted") {
          const userData = userDeletedEvent.data;

          await fastify.db.delete(users).where({ user_id: userData.id });

          request.log.info(`User deleted webhook processed successfully. User with id ${userData.id} deleted`);
        }
        reply.send({ message: "User deleted webhook processed successfully. User has been removed from the db" });
      },
    });
}
