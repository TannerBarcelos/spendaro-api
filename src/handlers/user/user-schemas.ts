import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import * as schema from "@/db/schema";
import { commonHttpResponseSchema } from "@/utils/http";

export const foundUserSchema = createSelectSchema(schema.users);
export const updateUserSchema = foundUserSchema.partial();

export type TUserToUpdate = z.infer<typeof updateUserSchema>;
export type TFoundUserResult = z.infer<typeof foundUserSchema>;

export const userDetailsResponseSchema = commonHttpResponseSchema.extend({
  data: foundUserSchema,
});

export const userDeletedResponseSchema = z.object({
  message: z.string(),
});
