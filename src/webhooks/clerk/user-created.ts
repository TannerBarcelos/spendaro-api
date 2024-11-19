import type { FastifyReply, FastifyRequest } from "fastify";

import { z } from "zod";

export const VerificationSchema = z.object({
  status: z.string(),
  strategy: z.string(),
});

export const EmailAddressSchema = z.object({
  email_address: z.string(),
  id: z.string(),
  linked_to: z.array(z.any()),
  object: z.string(),
  verification: VerificationSchema,
});

export const MetadataSchema = z.object({});

export const HTTPRequestSchema = z.object({
  client_ip: z.string(),
  user_agent: z.string(),
});

export const EventAttributesSchema = z.object({
  http_request: HTTPRequestSchema,
});

export const DataSchema = z.object({
  birthday: z.string(),
  created_at: z.number(),
  email_addresses: z.array(EmailAddressSchema),
  external_accounts: z.array(z.any()),
  external_id: z.string(),
  first_name: z.string(),
  gender: z.string(),
  id: z.string(),
  image_url: z.string(),
  last_name: z.string(),
  last_sign_in_at: z.number(),
  object: z.string(),
  password_enabled: z.boolean(),
  phone_numbers: z.array(z.any()),
  primary_email_address_id: z.string(),
  primary_phone_number_id: z.null(),
  primary_web3_wallet_id: z.null(),
  private_metadata: MetadataSchema,
  profile_image_url: z.string(),
  public_metadata: MetadataSchema,
  two_factor_enabled: z.boolean(),
  unsafe_metadata: MetadataSchema,
  updated_at: z.number(),
  username: z.null(),
  web3_wallets: z.array(z.any()),
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
