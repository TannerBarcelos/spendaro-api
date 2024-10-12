import { buildJsonSchemas } from "fastify-zod";

import * as schema from "./schema";

// Inferring Zod schemas from the tables so we can use it in application code to validate data.
// Also inferring the types so we can use them in function arguments and return types.

import type z from "zod";

import { createInsertSchema, createSelectSchema } from "drizzle-zod";

// User schema
export const signupUserSchema = createInsertSchema(schema.users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export const signinUserSchema = signupUserSchema.pick({ email: true, password: true });
export const updateUserSchema = signupUserSchema.partial();
export type TInsertUser = z.infer<typeof signupUserSchema>;
export type TUpdateUser = z.infer<typeof updateUserSchema>;

export const selectUserSchema = createSelectSchema(schema.users);
export type TUserResult = z.infer<typeof selectUserSchema>;

// Budget schema
export const insertBudgetSchema = createInsertSchema(schema.budgets).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export const selectBudgetSchema = createSelectSchema(schema.budgets);
export const updateBudgetSchema = insertBudgetSchema.partial().omit({ user_id: true });
export const deleteBudgetSchema = createInsertSchema(schema.budgets).pick({ id: true });
export type TInsertBudget = z.infer<typeof insertBudgetSchema>;
export type TUpdateBudget = z.infer<typeof updateBudgetSchema>;
export type TDeleteBudget = z.infer<typeof deleteBudgetSchema>;
export type TBudgetResult = z.infer<typeof selectBudgetSchema>;

// Budget category schema
export const insertBudgetCategorySchema = createInsertSchema(
  schema.budget_categories,
).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export const updateBudgetCategorySchema = insertBudgetCategorySchema.partial().omit({ budget_id: true });
export type TBudgetCategory = z.infer<typeof insertBudgetCategorySchema>;
export type TUpdateBudgetCategory = z.infer<typeof updateBudgetCategorySchema>;

export const selectBudgetCategorySchema = createSelectSchema(
  schema.budget_categories,
);
export type TBudgetCategoryResult = z.infer<typeof selectBudgetCategorySchema>;

// Budget category item schema
export const insertBudgetCategoryItemSchema = createInsertSchema(
  schema.budget_category_items,
).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export const updateBudgetCategoryItemSchema = insertBudgetCategoryItemSchema.partial().omit({ category_id: true, budget_id: true });
export type TBudgetCategoryItem = z.infer<
  typeof insertBudgetCategoryItemSchema
>;
export type TUpdateBudgetCategoryItem = z.infer<
  typeof updateBudgetCategoryItemSchema
>;

export const selectBudgetCategoryItemSchema = createSelectSchema(
  schema.budget_category_items,
);
export type TBudgetCategoryItemResult = z.infer<
  typeof selectBudgetCategoryItemSchema
>;

// Budget category item transaction schema
export const insertTransactionSchema = createInsertSchema(schema.transactions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export const updateTransactionSchema = insertTransactionSchema.partial().omit({ budget_id: true });
export type TTransaction = z.infer<typeof insertTransactionSchema>;
export type TUpdateTransaction = z.infer<typeof updateTransactionSchema>;

export const selectTransactionSchema = createSelectSchema(schema.transactions);
export type TTransactionResult = z.infer<typeof selectTransactionSchema>;

// Budget category item transaction type schema
export const insertTransactionTypeSchema = createInsertSchema(
  schema.transaction_types,
).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export const updateTransactionTypeSchema = insertTransactionTypeSchema.partial().omit({ budget_id: true });
export type TTransactionType = z.infer<typeof insertTransactionTypeSchema>;
export type TUpdateTransactionType = z.infer<typeof updateTransactionTypeSchema>;

export const selectTransactionTypeSchema = createSelectSchema(
  schema.transaction_types,
);
export type TTransactionTypeResult = z.infer<
  typeof selectTransactionTypeSchema
>;

// **************************************************
// **************************************************
// **************************************************
// **************************************************
// **************************************************

export const { schemas: spendaroSchemas, $ref } = buildJsonSchemas({
  signupUserSchema,
  signinUserSchema,
  updateUserSchema,
  selectUserSchema,
  insertBudgetSchema,
  selectBudgetSchema,
  updateBudgetSchema,
  deleteBudgetSchema,
  insertBudgetCategorySchema,
  updateBudgetCategorySchema,
  selectBudgetCategorySchema,
  insertBudgetCategoryItemSchema,
  updateBudgetCategoryItemSchema,
  selectBudgetCategoryItemSchema,
  insertTransactionSchema,
  updateTransactionSchema,
  selectTransactionSchema,
  insertTransactionTypeSchema,
  updateTransactionTypeSchema,
  selectTransactionTypeSchema,

  // Add more schemas here
});
