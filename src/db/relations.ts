import { relations } from 'drizzle-orm';
import * as schema from './schema';

export const usersRelations = relations(schema.users, ({ many }) => ({
  budgets: many(schema.budgets),
}));

export const budgetsRelations = relations(schema.budgets, ({ one, many }) => ({
  user: one(schema.users, {
    fields: [schema.budgets.user_id],
    references: [schema.users.id],
  }),
  categories: many(schema.budget_categories),
}));

export const budgetCategoriesRelations = relations(
  schema.budget_categories,
  ({ one, many }) => ({
    budget: one(schema.budgets, {
      fields: [schema.budget_categories.budget_id],
      references: [schema.budgets.id],
    }),
    budget_category_items: many(schema.budget_category_items),
  })
);

export const budgetCategoryItemsRelations = relations(
  schema.budget_category_items,
  ({ one, many }) => ({
    category: one(schema.budget_categories, {
      fields: [schema.budget_category_items.category_id],
      references: [schema.budget_categories.id],
    }),
    transactions: many(schema.transactions), // an item in a category can have N transactions, so we need to establish a one-to-many relationship for N transactions to one item
  })
);

export const transactionsRelations = relations(
  schema.transactions,
  ({ one }) => ({
    budget: one(schema.budgets, {
      fields: [schema.transactions.budget_id],
      references: [schema.budgets.id],
    }),
    transaction_type: one(schema.transaction_types),
  })
);
