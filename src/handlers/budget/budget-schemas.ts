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

// Budget category schemas
export const createBudgetCategorySchema = createInsertSchema(schema.budget_categories).omit(commonFields);
export const updateBudgetCategorySchema = createBudgetCategorySchema.partial().omit({ budget_id: true });
export const deleteBudgetCategorySchema = z.object({ id: z.number() });
export const foundBudgetCategorySchema = createSelectSchema(schema.budget_categories);

export const foundBudgetCategoriesResponseSchema = commonHttpResponseSchema.extend({
  data: z.array(foundBudgetCategorySchema),
});
export const foundBudgetCategoryResponseSchema = commonHttpResponseSchema.extend({
  data: foundBudgetCategorySchema,
});
export const createdBudgetCategoryResponseSchema = commonHttpResponseSchema.extend({
  data: foundBudgetCategorySchema,
});
export const updatedBudgetCategoryResponseSchema = commonHttpResponseSchema.extend({
  data: foundBudgetCategorySchema,
});
export const deletedBudgetCategoryResponseSchema = commonHttpResponseSchema.extend({
  data: foundBudgetCategorySchema,
});
export const budgetCategoryNotFoundResponseSchema = errorResponseSchema;

export type TBudgetCategoryToCreate = z.infer<typeof createBudgetCategorySchema>;
export type TBudgetCategoryToUpdate = z.infer<typeof updateBudgetCategorySchema>;
export type TBudgetCategoryToDelete = z.infer<typeof deleteBudgetCategorySchema>;
export type TBudgetCategoryResult = z.infer<typeof foundBudgetCategorySchema>;
