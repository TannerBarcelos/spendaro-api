import type { z } from "zod";

import { createSelectSchema } from "drizzle-zod";

import * as schema from "@/db/schema";
import { commonHttpResponseSchema } from "@/utils/http";

import type { signinUserSchema } from "../auth/auth-schemas";

import { signupUserSchema } from "../auth/auth-schemas";

export const foundUserSchema = createSelectSchema(schema.users);

export const updateUserSchema = signupUserSchema.partial();

export type TUserToUpdate = z.infer<typeof updateUserSchema>;
export type TUserToCreate = z.infer<typeof signupUserSchema>;
export type TCandidateUser = z.infer<typeof signinUserSchema>;
export type TFoundUserResult = z.infer<typeof foundUserSchema>;

export const userDetailsResponseSchema = commonHttpResponseSchema.extend({
  data: foundUserSchema.omit({ password: true }),
});
