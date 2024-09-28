import { integer, pgTable, serial, text, varchar } from 'drizzle-orm/pg-core';

// This table is used to store the users of the application
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  fullName: text('full_name'),
  email: varchar('email').unique(),
  password_hash: text('password_hash'),
  created_at: text('created_at'),
  updated_at: text('updated_at'),
});

// This table is used to store the budgets that belong to a user
export const budgets = pgTable('budgets', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').references(() => users.id),
  budget_name: text('budget_name'),
  budget_description: text('budget_description'),
  assigned_amount: integer('assigned_amount').default(0),
  created_at: text('created_at'),
  updated_at: text('updated_at'),
});

// This table is used to store the categories that belong to a budget
export const budget_categories = pgTable('budget_categories', {
  id: serial('id').primaryKey(),
  budget_id: integer('budget_id').references(() => budgets.id),
  category_name: text('category_name'),
  category_description: text('category_description'),
  created_at: text('created_at'),
  updated_at: text('updated_at'),
});

// This table is used to store the items that belong to a budget category
export const budget_category_items = pgTable('budget_category_items', {
  id: serial('id').primaryKey(),
  category_id: integer('category_id').references(() => budget_categories.id),
  item_name: text('item_name'),
  item_description: text('item_description'),
  item_amount: integer('item_amount').default(0),
  created_at: text('created_at'),
  updated_at: text('updated_at'),
});

// This table is used to store the transactions made and assign them to a budget category item
export const budget_category_item_transactions = pgTable('budget_category_item_transactions', {
  id: serial('id').primaryKey(),
  item_id: integer('item_id').references(() => budget_category_items.id),
  transaction_amount: integer('transaction_amount'),
  transaction_date: text('transaction_date'),
  transaction_description: text('transaction_description'),
  created_at: text('created_at'),
  updated_at: text('updated_at'),
});

// This table is used to store the types of transactions that can be made on a budget category item i.e. income, expense, etc. (not using enum as users can add their own transaction types)
export const budget_category_item_transaction_types = pgTable('budget_category_item_transaction_types', {
  id: serial('id').primaryKey(),
  transaction_type: text('transaction_type'),
  created_at: text('created_at'),
  updated_at: text('updated_at'),
});