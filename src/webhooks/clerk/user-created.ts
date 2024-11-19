import type { FastifyReply, FastifyRequest } from "fastify";

import { z } from "zod";

// These types are directly pasted as json into zod schemas from the test-webhook payload in the Clerk dashboard.
// I had no idea what the types were - don't assume I knew what I was defining here because I could rely on Clerk to provide the types for me.

// This is the payload that Clerk sends to the webhook endpoint when a user is created.
// {
//   "data": {
//     "birthday": "",
//       "created_at": 1654012591514,
//         "email_addresses": [
//           {
//             "email_address": "example@example.org",
//             "id": "idn_29w83yL7CwVlJXylYLxcslromF1",
//             "linked_to": [],
//             "object": "email_address",
//             "verification": {
//               "status": "verified",
//               "strategy": "ticket"
//             }
//           }
//         ],
//           "external_accounts": [],
//             "external_id": "567772",
//               "first_name": "Example",
//                 "gender": "",
//                   "id": "user_29w83sxmDNGwOuEthce5gg56FcC",
//                     "image_url": "https://img.clerk.com/xxxxxx",
//                       "last_name": "Example",
//                         "last_sign_in_at": 1654012591514,
//                           "object": "user",
//                             "password_enabled": true,
//                               "phone_numbers": [],
//                                 "primary_email_address_id": "idn_29w83yL7CwVlJXylYLxcslromF1",
//                                   "primary_phone_number_id": null,
//                                     "primary_web3_wallet_id": null,
//                                       "private_metadata": { },
//     "profile_image_url": "https://www.gravatar.com/avatar?d=mp",
//       "public_metadata": { },
//     "two_factor_enabled": false,
//       "unsafe_metadata": { },
//     "updated_at": 1654012591835,
//       "username": null,
//         "web3_wallets": []
//   },
//   "event_attributes": {
//     "http_request": {
//       "client_ip": "0.0.0.0",
//         "user_agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36"
//     }
//   },
//   "object": "event",
//     "timestamp": 1654012591835,
//       "type": "user.created"
// }

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
