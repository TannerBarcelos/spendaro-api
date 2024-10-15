import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import z from "zod";

import * as schema from "@/db/schema";
import { commonHttpResponseSchema } from "@/utils/http";

import { errorResponseSchema } from "../error/error-schemas";

const commonFields = {
  id: true as const,
  createdAt: true as const,
  updatedAt: true as const,
};

// Budget schemas / types: Used for the actual I/O types as well as schema validation in the handlers via zod-type-provider
export const createBudgetSchema = createInsertSchema(schema.budgets).omit(commonFields);
export const updateBudgetSchema = createBudgetSchema.partial().omit({ user_id: true });
export const deleteBudgetSchema = z.object({ id: z.number() });
export const foundBudgetSchema = createSelectSchema(schema.budgets);

export const foundBudgetsResponseSchema = commonHttpResponseSchema.extend({
  data: z.array(foundBudgetSchema),
});
export const foundBudgetResponseSchema = commonHttpResponseSchema.extend({
  data: foundBudgetSchema,
});
export const createdBudgetResponseSchema = commonHttpResponseSchema.extend({
  data: foundBudgetSchema,
});
export const updatedBudgetResponseSchema = commonHttpResponseSchema.extend({
  data: foundBudgetSchema,
});
export const deletedBudgetResponseSchema = commonHttpResponseSchema.extend({
  data: foundBudgetSchema,
});

export const budgetNotFoundResponseSchema = errorResponseSchema;
export type TBudgetToCreate = z.infer<typeof createBudgetSchema>;
export type TBudgetToUpdate = z.infer<typeof updateBudgetSchema>;
export type TBudgetToDelete = z.infer<typeof deleteBudgetSchema>;
export type TBudgetResult = z.infer<typeof foundBudgetSchema>;
