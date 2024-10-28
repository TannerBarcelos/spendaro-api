import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

import * as schema from "@/db/schema";

export const signupUserSchema = createInsertSchema(schema.users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export const signinUserSchema = signupUserSchema.pick({ email: true, password: true });

// Response serialization schemas
export const authResponseSchema = z.object({
  message: z.string(),
});
