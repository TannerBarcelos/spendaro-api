import { buildJsonSchemas } from "fastify-zod";

import * as schema from "./schema";

// Inferring Zod schemas from the tables so we can use it in application code to validate data.
// Also inferring the types so we can use them in function arguments and return types.

import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import z from "zod";

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

export type TBudgetToCreate = z.infer<typeof createBudgetSchema>;
export type TBudgetToUpdate = z.infer<typeof updateBudgetSchema>;
export type TBudgetToDelete = z.infer<typeof deleteBudgetSchema>;
export type TBudgetResult = z.infer<typeof foundBudgetSchema>;

// Budget category schemas
export const createBudgetCategorySchema = createInsertSchema(schema.budget_categories).omit(commonFields);
export const updateBudgetCategorySchema = createBudgetCategorySchema.partial().omit({ budget_id: true });
export const deleteBudgetCategorySchema = z.object({ id: z.number() });
export const foundBudgetCategorySchema = createSelectSchema(schema.budget_categories);

export type TBudgetCategoryToCreate = z.infer<typeof createBudgetCategorySchema>;
export type TBudgetCategoryToUpdate = z.infer<typeof updateBudgetCategorySchema>;
export type TBudgetCategoryToDelete = z.infer<typeof deleteBudgetCategorySchema>;
export type TBudgetCategoryResult = z.infer<typeof foundBudgetCategorySchema>;

// Budget category item schemas
export const createBudgetCategoryItemSchema = createInsertSchema(schema.budget_category_items).omit(commonFields);
export const updateBudgetCategoryItemSchema = createBudgetCategoryItemSchema.partial().omit({ category_id: true, budget_id: true });
export const deleteBudgetCategoryItemSchema = z.object({ id: z.number() });
export const foundBudgetCategoryItemSchema = createSelectSchema(schema.budget_category_items);

export type TBudgetCategoryItemToCreate = z.infer<typeof createBudgetCategoryItemSchema>;
export type TBudgetCategoryItemToUpdate = z.infer<typeof updateBudgetCategoryItemSchema>;
export type TBudgetCategoryItemToDelete = z.infer<typeof deleteBudgetCategoryItemSchema>;
export type TBudgetCategoryItemResult = z.infer<typeof foundBudgetCategoryItemSchema>;

// Transaction schemas
export const createTransactionSchema = createInsertSchema(schema.transactions).omit(commonFields);
export const updateTransactionSchema = createTransactionSchema.partial().omit({ budget_id: true });
export const deleteTransactionSchema = z.object({ id: z.number() });
export const foundTransactionSchema = createSelectSchema(schema.transactions);

export type TTransactionToCreate = z.infer<typeof createTransactionSchema>;
export type TTransactionToUpdate = z.infer<typeof updateTransactionSchema>;
export type TTransactionToDelete = z.infer<typeof deleteTransactionSchema>;
export type TTransactionResult = z.infer<typeof foundTransactionSchema>;

// Transaction type schemas
export const createTransactionTypeSchema = createInsertSchema(schema.transaction_types).omit(commonFields);
export const updateTransactionTypeSchema = createTransactionTypeSchema.partial().omit({ budget_id: true });
export const deleteTransactionTypeSchema = z.object({ id: z.number() });
export const foundTransactionTypeSchema = createSelectSchema(schema.transaction_types);

export type TTransactionTypeToCreate = z.infer<typeof createTransactionTypeSchema>;
export type TTransactionTypeToUpdate = z.infer<typeof updateTransactionTypeSchema>;
export type TTransactionTypeToDelete = z.infer<typeof deleteTransactionTypeSchema>;
export type TTransactionTypeResult = z.infer<typeof foundTransactionTypeSchema>;

// Exporting all schemas as JSON schemas and $ref for use in the application
export const { schemas: spendaroSchemas, $ref } = buildJsonSchemas({
  createBudgetSchema,
  foundBudgetSchema,
  updateBudgetSchema,
  deleteBudgetSchema,
  createBudgetCategorySchema,
  updateBudgetCategorySchema,
  foundBudgetCategorySchema,
  createBudgetCategoryItemSchema,
  updateBudgetCategoryItemSchema,
  foundBudgetCategoryItemSchema,
  createTransactionSchema,
  updateTransactionSchema,
  foundTransactionSchema,
  createTransactionTypeSchema,
  updateTransactionTypeSchema,
  foundTransactionTypeSchema,
});
