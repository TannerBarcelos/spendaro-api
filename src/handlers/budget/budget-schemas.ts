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

// Budget schemas
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

// Budget category item schemas
export const createBudgetCategoryItemSchema = createInsertSchema(schema.budget_category_items).omit(commonFields);
export const updateBudgetCategoryItemSchema = createBudgetCategoryItemSchema.partial().omit({ category_id: true, budget_id: true });
export const deleteBudgetCategoryItemSchema = z.object({ id: z.number() });
export const foundBudgetCategoryItemSchema = createSelectSchema(schema.budget_category_items);

export const foundBudgetCategoryItemsResponseSchema = commonHttpResponseSchema.extend({
  data: z.array(foundBudgetCategoryItemSchema),
});
export const foundBudgetCategoryItemResponseSchema = commonHttpResponseSchema.extend({
  data: foundBudgetCategoryItemSchema,
});
export const createdBudgetCategoryItemResponseSchema = commonHttpResponseSchema.extend({
  data: foundBudgetCategoryItemSchema,
});
export const updatedBudgetCategoryItemResponseSchema = commonHttpResponseSchema.extend({
  data: foundBudgetCategoryItemSchema,
});
export const deletedBudgetCategoryItemResponseSchema = commonHttpResponseSchema.extend({
  data: foundBudgetCategoryItemSchema,
});
export const deletedAllBudgetCategoryItemResponseSchema = commonHttpResponseSchema.extend({
  data: z.array(foundBudgetCategoryItemSchema),
});
export const budgetCategoryItemNotFoundResponseSchema = errorResponseSchema;

export type TBudgetCategoryItemToCreate = z.infer<typeof createBudgetCategoryItemSchema>;
export type TBudgetCategoryItemToUpdate = z.infer<typeof updateBudgetCategoryItemSchema>;
export type TBudgetCategoryItemToDelete = z.infer<typeof deleteBudgetCategoryItemSchema>;
export type TBudgetCategoryItemResult = z.infer<typeof foundBudgetCategoryItemSchema>;

// Transaction schemas
export const createTransactionSchema = createInsertSchema(schema.transactions).omit(commonFields);
export const updateTransactionSchema = createTransactionSchema.partial().omit({ budget_id: true });
export const deleteTransactionSchema = z.object({ id: z.number() });
export const foundTransactionSchema = createSelectSchema(schema.transactions);

export const foundTransactionsResponseSchema = commonHttpResponseSchema.extend({
  data: z.array(foundTransactionSchema),
});
export const foundTransactionResponseSchema = commonHttpResponseSchema.extend({
  data: foundTransactionSchema,
});
export const createdTransactionResponseSchema = commonHttpResponseSchema.extend({
  data: foundTransactionSchema,
});
export const updatedTransactionResponseSchema = commonHttpResponseSchema.extend({
  data: foundTransactionSchema,
});
export const deletedTransactionResponseSchema = commonHttpResponseSchema.extend({
  data: foundTransactionSchema,
});

export const transactionNotFoundResponseSchema = errorResponseSchema;

export type TTransactionToCreate = z.infer<typeof createTransactionSchema>;
export type TTransactionToUpdate = z.infer<typeof updateTransactionSchema>;
export type TTransactionToDelete = z.infer<typeof deleteTransactionSchema>;
export type TTransactionResult = z.infer<typeof foundTransactionSchema>;

// Transaction type schemas
export const createTransactionTypeSchema = createInsertSchema(schema.transaction_types).omit(commonFields);
export const updateTransactionTypeSchema = createTransactionTypeSchema.partial().omit({ budget_id: true });
export const deleteTransactionTypeSchema = z.object({ id: z.number() });
export const foundTransactionTypeSchema = createSelectSchema(schema.transaction_types);

export const foundTransactionTypesResponseSchema = commonHttpResponseSchema.extend({
  data: z.array(foundTransactionTypeSchema),
});
export const foundTransactionTypeResponseSchema = commonHttpResponseSchema.extend({
  data: foundTransactionTypeSchema,
});
export const createdTransactionTypeResponseSchema = commonHttpResponseSchema.extend({
  data: foundTransactionTypeSchema,
});
export const updatedTransactionTypeResponseSchema = commonHttpResponseSchema.extend({
  data: foundTransactionTypeSchema,
});
export const deletedTransactionTypeResponseSchema = commonHttpResponseSchema.extend({
  data: foundTransactionTypeSchema,
});
export const transactionTypeNotFoundResponseSchema = errorResponseSchema;

export type TTransactionTypeToCreate = z.infer<typeof createTransactionTypeSchema>;
export type TTransactionTypeToUpdate = z.infer<typeof updateTransactionTypeSchema>;
export type TTransactionTypeToDelete = z.infer<typeof deleteTransactionTypeSchema>;
export type TTransactionTypeResult = z.infer<typeof foundTransactionTypeSchema>;
