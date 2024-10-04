import * as schema from '@/db/schema';

// Inferring Zod schemas from the tables so we can use it in application code to validate data.
// Also inferring the types so we can use them in function arguments and return types.

import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import z from 'zod';

// User schema
export const insertUserSchema = createInsertSchema(schema.users);
export type TUser = z.infer<typeof insertUserSchema>;

export const selectUserSchema = createSelectSchema(schema.users);
export type TUserResult = z.infer<typeof selectUserSchema>;

// Budget schema
export const insertBudgetSchema = createInsertSchema(schema.budgets);
export type TBudget = z.infer<typeof insertBudgetSchema>;

export const selectBudgetSchema = createSelectSchema(schema.budgets);
export type TBudgetResult = z.infer<typeof selectBudgetSchema>;

// Budget category schema
export const insertBudgetCategorySchema = createInsertSchema(
  schema.budget_categories
);
export type TBudgetCategory = z.infer<typeof insertBudgetCategorySchema>;

export const selectBudgetCategorySchema = createSelectSchema(
  schema.budget_categories
);
export type TBudgetCategoryResult = z.infer<typeof selectBudgetCategorySchema>;

// Budget category item schema
export const insertBudgetCategoryItemSchema = createInsertSchema(
  schema.budget_category_items
);
export type TBudgetCategoryItem = z.infer<
  typeof insertBudgetCategoryItemSchema
>;

export const selectBudgetCategoryItemSchema = createSelectSchema(
  schema.budget_category_items
);
export type TBudgetCategoryItemResult = z.infer<
  typeof selectBudgetCategoryItemSchema
>;

// Budget category item transaction schema
export const insertTransactionSchema = createInsertSchema(schema.transactions);
export type TTransaction = z.infer<typeof insertTransactionSchema>;

export const selectTransactionSchema = createSelectSchema(schema.transactions);
export type TTransactionResult = z.infer<typeof selectTransactionSchema>;

// Budget category item transaction type schema
export const insertTransactionTypeSchema = createInsertSchema(
  schema.transaction_types
);
export type TTransactionType = z.infer<typeof insertTransactionTypeSchema>;

export const selectTransactionTypeSchema = createSelectSchema(
  schema.transaction_types
);
export type TTransactionTypeResult = z.infer<
  typeof selectTransactionTypeSchema
>;
