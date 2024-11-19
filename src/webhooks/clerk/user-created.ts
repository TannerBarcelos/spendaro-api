import type { FastifyReply, FastifyRequest } from "fastify";

import { z } from "zod";

// These types are directly pasted as json into zod schemas from the test-webhook payload in the Clerk dashboard.
// I had no idea what the types were - don't assume I knew what I was defining here because I could rely on Clerk to provide the types for me.

export const VerificationSchema = z.object({
  status: z.string(),
  strategy: z.string(),
});

export const MetadataSchema = z.object({});

export const HTTPRequestSchema = z.object({
  client_ip: z.string(),
  user_agent: z.string(),
});

export const EventAttributesSchema = z.object({
  http_request: HTTPRequestSchema,
});

// how to pass a type to be used in the schema?
export const DataSchema = z.object({
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

export async function userCreated(request: FastifyRequest, reply: FastifyReply) {
  request.log.info("webhook called: user-create. Creating new user with data: ");
  reply.send("ok");
}
