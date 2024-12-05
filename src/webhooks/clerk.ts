import type { WebhookEvent } from "@clerk/fastify";
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

import { clerkClient } from "@clerk/clerk-sdk-node";
import { eq } from "drizzle-orm";
import { Webhook } from "svix";
import { z } from "zod";

import type { TUserToCreate } from "@/handlers/budget/budget-schemas";

import { users } from "@/db/schema";
import { env } from "@/env";
import { SpendaroError } from "@/utils/error";

const WebhookHeaders = z.object({
  "svix-id": z.string(),
  "svix-timestamp": z.string(),
  "svix-signature": z.string(),
});

function verifySvixHeaders(request: any, webhookKey: string): WebhookEvent {
  const requestBody = JSON.stringify(request.body);
  const wh = new Webhook(webhookKey);

  const headers = request.headers;
  const svix_id = headers["svix-id"];
  const svix_timestamp = headers["svix-timestamp"];
  const svix_signature = headers["svix-signature"];

  try {
    const verifiedHeaders = wh.verify(requestBody, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;

    return verifiedHeaders;
  }
  // Will be caught at the application level error handler
  catch (err) {
    console.error("Error: Could not verify webhook:", err);
    throw new SpendaroError("Error: Verification error", 400, ["Verification error"]);
  }
}

export async function clerkWebhooks(fastify: FastifyInstance) {
  fastify
    .withTypeProvider<ZodTypeProvider>()
    .route({
      method: "POST",
      url: "/user-created",
      schema: {
        summary: "Handle user created webhook from Clerk",
        tags: ["webhooks"],
        headers: WebhookHeaders,
      },
      handler: async (request, reply) => {
        request.log.info("User created webhook received. Creating new user with basic info");

        const userCreatedEvent = verifySvixHeaders(request, env.CLERK_WEBHOOK_CREATED_USER_KEY);

        request.log.info(`Received webhook with ID ${userCreatedEvent.data.id} and event type of ${userCreatedEvent.type}`);

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
        headers: WebhookHeaders,
      },
      handler: async (request, reply) => {
        request.log.info("User deleted webhook received. Deleting user now.");

        const userDeletedEvent = verifySvixHeaders(request, env.CLERK_WEBHOOK_CREATED_USER_KEY);

        request.log.info(`Received webhook with ID ${userDeletedEvent.data.id} and event type of ${userDeletedEvent.type}`);

        if (userDeletedEvent.type === "user.deleted") {
          const userData = userDeletedEvent.data;
          if (userData.id) {
            await fastify.db.delete(users).where(eq(users.user_id, userData.id));
            request.log.info(`User deleted webhook processed successfully. User with id ${userData.id} deleted`);
          }
          else {
            request.log.error("User ID is undefined. Cannot delete user.");
            reply.send({ message: "User ID is undefined. Cannot delete user." });
          }
        }
        reply.send({ message: "User deleted webhook processed successfully. User has been removed from the db" });
      },
    });
}
