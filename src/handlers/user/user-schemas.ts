import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import * as schema from "@/db/schema";
import { commonHttpResponseSchema } from "@/utils/http";

import { foundUserSchema } from "../auth/auth-schemas";

export const userDetailsResponseSchema = commonHttpResponseSchema.extend({
  data: foundUserSchema.omit({ password: true }),
});
