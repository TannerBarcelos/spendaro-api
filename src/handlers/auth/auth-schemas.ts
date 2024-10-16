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
export const commonAuthResponseSchema = z.object({
  message: z.string(),
});

export const signinResponseUnauthorizedSchema = errorResponseSchema;
export const duplicateSignupUserSchema = errorResponseSchema;
export const userNotFoundResponseSchema = errorResponseSchema;
export const userDetailsResponseSchema = commonHttpResponseSchema.extend({
  data: foundUserSchema.omit({ password: true }),
});
