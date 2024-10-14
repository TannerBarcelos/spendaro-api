import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import * as schema from "@/db/schema";
import { commonHttpResponseSchema } from "@/utils/http";

import { errorResponseSchema } from "../error/error-schemas";

export const signupUserSchema = createInsertSchema(schema.users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export const signinUserSchema = signupUserSchema.pick({ email: true, password: true });
export const updateUserSchema = signupUserSchema.partial();
export const deleteUserSchema = z.object({ id: z.number() });
export const foundUserSchema = createSelectSchema(schema.users);

export type TUserToCreate = z.infer<typeof signupUserSchema>;
export type TUserToUpdate = z.infer<typeof updateUserSchema>;
export type TUserToDelete = z.infer<typeof deleteUserSchema>;
export type TCandidateUser = z.infer<typeof signinUserSchema>;
export type TFoundUserResult = z.infer<typeof foundUserSchema>;

// RESPONSE SCHEMAS FOR JSONS SERIZALIZATION AND JSON SCHEMA VALIDATION
export const signinResponseSchema = commonHttpResponseSchema.extend({
  data: z.object({
    access_token: z.string()
      .describe("The JWT token to be used for authentication. Contains the user_id and expiration date."),
  }).describe("The response data. Contains the JWT token."),
});
export const signinResponseUnauthorizedSchema = errorResponseSchema;
export const signupResponseSchema = signinResponseSchema;
export const duplicateSignupUserSchema = errorResponseSchema;
