import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import * as schema from "@/db/schema";

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

export const authResponseSchema = z.object({
  message: z.string(),
});
