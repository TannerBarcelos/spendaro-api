import { relations, sql } from 'drizzle-orm';
import { timestamp } from 'drizzle-orm/pg-core';
import { date } from 'drizzle-orm/pg-core';
import { integer, pgTable, serial, text, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

const now = sql`now()`;
const createdTs = timestamp('created_at', { mode: 'string' }).default(now);
const updatedTs = timestamp('updated_at', { mode: 'string' }).default(now);

// This table is used to store the users of the application
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  email: varchar('email').unique().notNull(),
  password: text('password_hash').notNull(),
  created_at: createdTs,
  updated_at: updatedTs,
});

export const usersRelations = relations(users, ({ many }) => ({
  budgets: many(budgets),
}));

// This table is used to store the budgets that belong to a user
export const budgets = pgTable('budgets', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').references(() => users.id, {
    onDelete: 'cascade',
  }), // when a user is deleted, all their budgets should be deleted as well
  budget_name: text('budget_name').notNull(),
  budget_description: text('budget_description').default(''),
  assigned_amount: integer('assigned_amount').default(0),
  created_at: createdTs,
  updated_at: updatedTs,
});

export const budgetsRelations = relations(budgets, ({ one, many }) => ({
  user: one(users),
  categories: many(budget_categories),
}));

// This table is used to store the categories that belong to a budget
export const budget_categories = pgTable('budget_categories', {
  id: serial('id').primaryKey(),
  budget_id: integer('budget_id').references(() => budgets.id, {
    onDelete: 'cascade',
  }), // when a budget is deleted, all its categories should be deleted as well
  category_name: text('category_name').notNull(),
  category_description: text('category_description').default(''),
  created_at: createdTs,
  updated_at: updatedTs,
});

export const budgetCategoriesRelations = relations(
  budget_categories,
  ({ one, many }) => ({
    budget: one(budgets),
    budget_category_items: many(budget_category_items),
  })
);

// This table is used to store the items that belong to a budget category
export const budget_category_items = pgTable('budget_category_items', {
  id: serial('id').primaryKey(),
  category_id: integer('category_id').references(() => budget_categories.id, {
    onDelete: 'cascade',
  }), // when a category is deleted, all its items should be deleted as well
  item_name: text('item_name').notNull(),
  item_description: text('item_description').default(''),
  item_amount: integer('item_amount').default(0),
  created_at: createdTs,
  updated_at: updatedTs,
});

export const budgetCategoryItemsRelations = relations(
  budget_category_items,
  ({ one, many }) => ({
    category: one(budget_categories),
    transactions: many(budget_category_item_transactions), // an item in a category can have N transactions, so we need to establish a one-to-many relationship for N transactions to one item
  })
);

// This table is used to store the transactions made and assign them to a budget category item
export const budget_category_item_transactions = pgTable(
  'budget_category_item_transactions',
  {
    id: serial('id').primaryKey(),
    item_id: integer('item_id').references(() => budget_category_items.id, {
      onDelete: 'cascade',
    }), // when an item is deleted, all its transactions should be deleted as well
    transaction_amount: integer('transaction_amount').notNull(),
    transaction_date: date('transaction_date').notNull(), // date of the transaction (can be different from the created_at date, so we need to store it separately)
    transaction_description: text('transaction_description').default(''),
    transaction_type_id: integer('transaction_type_id').references(
      () => budget_category_item_transaction_types.id,
      { onDelete: 'set null' }
    ), // when a transaction type is deleted, we should set the transaction type id to null since transactions should still persist
    created_at: createdTs,
    updated_at: updatedTs,
  }
);

export const budgetCategoryItemTransactionsRelations = relations(
  budget_category_item_transactions,
  ({ one }) => ({
    item: one(budget_category_items),
    transaction_type: one(budget_category_item_transaction_types),
  })
);

// This table is used to store the types of transactions that can be made on a budget category item i.e. income, expense, etc. (not using enum as users can add their own transaction types)
export const budget_category_item_transaction_types = pgTable(
  'budget_category_item_transaction_types',
  {
    id: serial('id').primaryKey(),
    transaction_type: text('transaction_type'),
    created_at: createdTs,
    updated_at: updatedTs,
  }
);

export type SpendaroSchema = {
  users: typeof users;
  budgets: typeof budgets;
  budget_categories: typeof budget_categories;
  budget_category_items: typeof budget_category_items;
  budget_category_item_transactions: typeof budget_category_item_transactions;
  budget_category_item_transaction_types: typeof budget_category_item_transaction_types;
};

// Inferring Zod schemas from the tables so we can use it in application code to validate data.
// Also inferring the types so we can use them in function arguments and return types.

// User schema
export const insertUserSchema = createInsertSchema(users);
export type TUser = z.infer<typeof insertUserSchema>;

export const selectUserSchema = createSelectSchema(users);
export type TUserResult = z.infer<typeof selectUserSchema>;

// Budget schema
export const insertBudgetSchema = createInsertSchema(budgets);
export type TBudget = z.infer<typeof insertBudgetSchema>;

export const selectBudgetSchema = createSelectSchema(budgets);
export type TBudgetResult = z.infer<typeof selectBudgetSchema>;

// Budget category schema
export const insertBudgetCategorySchema = createInsertSchema(budget_categories);
export type TBudgetCategory = z.infer<typeof insertBudgetCategorySchema>;

export const selectBudgetCategorySchema = createSelectSchema(budget_categories);
export type TBudgetCategoryResult = z.infer<typeof selectBudgetCategorySchema>;

// Budget category item schema
export const insertBudgetCategoryItemSchema = createInsertSchema(
  budget_category_items
);
export type TBudgetCategoryItem = z.infer<
  typeof insertBudgetCategoryItemSchema
>;

export const selectBudgetCategoryItemSchema = createSelectSchema(
  budget_category_items
);
export type TBudgetCategoryItemResult = z.infer<
  typeof selectBudgetCategoryItemSchema
>;

// Budget category item transaction schema
export const insertBudgetCategoryItemTransactionSchema = createInsertSchema(
  budget_category_item_transactions
);
export type TBudgetCategoryItemTransaction = z.infer<
  typeof insertBudgetCategoryItemTransactionSchema
>;

export const selectBudgetCategoryItemTransactionSchema = createSelectSchema(
  budget_category_item_transactions
);
export type TBudgetCategoryItemTransactionResult = z.infer<
  typeof selectBudgetCategoryItemTransactionSchema
>;

// Budget category item transaction type schema
export const insertBudgetCategoryItemTransactionTypeSchema = createInsertSchema(
  budget_category_item_transaction_types
);
export type TBudgetCategoryItemTransactionType = z.infer<
  typeof insertBudgetCategoryItemTransactionTypeSchema
>;

export const selectBudgetCategoryItemTransactionTypeSchema = createSelectSchema(
  budget_category_item_transaction_types
);
export type TBudgetCategoryItemTransactionTypeResult = z.infer<
  typeof selectBudgetCategoryItemTransactionTypeSchema
>;
