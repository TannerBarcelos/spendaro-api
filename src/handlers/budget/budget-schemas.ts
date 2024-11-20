import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import z from "zod";

import * as schema from "@/db/schema";
import { commonHttpResponseSchema } from "@/utils/http";

const commonFields = {
  id: true as const,
  createdAt: true as const,
  updatedAt: true as const,
};

// User schemas
export const createUserSchema = createInsertSchema(schema.users);
export type TUserToCreate = z.infer<typeof createUserSchema>;

// Budget schemas
export const createBudgetSchema = createInsertSchema(schema.budgets).omit(commonFields);
export type TBudgetToCreate = z.infer<typeof createBudgetSchema>;

export const updateBudgetSchema = createBudgetSchema.partial().omit({ user_id: true });
export type TBudgetToUpdate = z.infer<typeof updateBudgetSchema>;

export const deleteBudgetSchema = z.object({ id: z.number() });
export type TBudgetToDelete = z.infer<typeof deleteBudgetSchema>;

export const foundBudgetSchema = createSelectSchema(schema.budgets);
export type TBudgetResult = z.infer<typeof foundBudgetSchema>;

// Budget response serializer schemas
export const foundBudgetsResponse = commonHttpResponseSchema.extend({
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

// Budget category schemas
export const createBudgetCategorySchema = createInsertSchema(schema.budget_categories).omit(commonFields);
export type TBudgetCategoryToCreate = z.infer<typeof createBudgetCategorySchema>;

export const updateBudgetCategorySchema = createBudgetCategorySchema.partial().omit({ budget_id: true });
export type TBudgetCategoryToUpdate = z.infer<typeof updateBudgetCategorySchema>;

export const deleteBudgetCategorySchema = z.object({ id: z.number() });
export type TBudgetCategoryToDelete = z.infer<typeof deleteBudgetCategorySchema>;

export const foundBudgetCategorySchema = createSelectSchema(schema.budget_categories);
export type TBudgetCategoryResult = z.infer<typeof foundBudgetCategorySchema>;

// Budget category response serializer schemas
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

// Budget category item schemas
export const createBudgetCategoryItemSchema = createInsertSchema(schema.budget_category_items).omit(commonFields);
export type TBudgetCategoryItemToCreate = z.infer<typeof createBudgetCategoryItemSchema>;

export const updateBudgetCategoryItemSchema = createBudgetCategoryItemSchema.partial().omit({ category_id: true, budget_id: true });
export type TBudgetCategoryItemToUpdate = z.infer<typeof updateBudgetCategoryItemSchema>;

export const deleteBudgetCategoryItemSchema = z.object({ id: z.number() });
export type TBudgetCategoryItemToDelete = z.infer<typeof deleteBudgetCategoryItemSchema>;

export const foundBudgetCategoryItemSchema = createSelectSchema(schema.budget_category_items);
export type TBudgetCategoryItemResult = z.infer<typeof foundBudgetCategoryItemSchema>;

// Budget category item response serializer schemas
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

// Transaction schemas
export const createTransactionSchema = createInsertSchema(schema.transactions).omit(commonFields);
export type TTransactionToCreate = z.infer<typeof createTransactionSchema>;

export const updateTransactionSchema = createTransactionSchema.partial().omit({ budget_id: true });
export type TTransactionToUpdate = z.infer<typeof updateTransactionSchema>;

export const deleteTransactionSchema = z.object({ id: z.number() });
export type TTransactionToDelete = z.infer<typeof deleteTransactionSchema>;

export const foundTransactionSchema = createSelectSchema(schema.transactions);
export type TTransactionResult = z.infer<typeof foundTransactionSchema>;

// Transaction response serializer schemas
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

// Transaction type schemas
export const createTransactionTypeSchema = createInsertSchema(schema.transaction_types).omit(commonFields);
export type TTransactionTypeToCreate = z.infer<typeof createTransactionTypeSchema>;

export const updateTransactionTypeSchema = createTransactionTypeSchema.partial().omit({ budget_id: true });
export type TTransactionTypeToUpdate = z.infer<typeof updateTransactionTypeSchema>;

export const deleteTransactionTypeSchema = z.object({ id: z.number() });
export type TTransactionTypeToDelete = z.infer<typeof deleteTransactionTypeSchema>;

export const foundTransactionTypeSchema = createSelectSchema(schema.transaction_types);
export type TTransactionTypeResult = z.infer<typeof foundTransactionTypeSchema>;

// Transaction type response serializer schemas
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
