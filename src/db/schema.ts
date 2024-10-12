import { relations } from "drizzle-orm";
import { date, integer, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

// This table is used to store the users of the application
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: varchar("email").unique().notNull(),
  password: text("password_hash").notNull(),
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date()),
  updatedAt: timestamp("updated_at").$defaultFn(() => new Date()).$onUpdateFn(() => new Date()),
});

// This table is used to store the budgets that belong to a user
export const budgets = pgTable("budgets", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").references(() => users.id, {
    onDelete: "cascade",
  }).notNull(), // when a user is deleted, all their budgets should be deleted as well
  budget_name: text("budget_name").notNull(),
  budget_description: text("budget_description").default(""),
  amount: integer("amount").default(0),
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date()),
  updatedAt: timestamp("updated_at").$defaultFn(() => new Date()).$onUpdateFn(() => new Date()),
});

// This table is used to store the categories that belong to a budget
export const budget_categories = pgTable("budget_categories", {
  id: serial("id").primaryKey(),
  budget_id: integer("budget_id").references(() => budgets.id, {
    onDelete: "cascade",
  }), // when a budget is deleted, all its categories should be deleted as well
  category_name: text("category_name").notNull(),
  category_description: text("category_description").default(""),
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date()),
  updatedAt: timestamp("updated_at").$defaultFn(() => new Date()).$onUpdateFn(() => new Date()),
});

// This table is used to store the items that belong to a budget category
export const budget_category_items = pgTable("budget_category_items", {
  id: serial("id").primaryKey(),
  category_id: integer("category_id").references(() => budget_categories.id, {
    onDelete: "cascade",
  }), // when a category is deleted, all its items should be deleted as well
  budget_id: integer("budget_id").references(() => budgets.id).notNull(), // no need to cascade because when a budget is deleted, all its categories get deleted and since this is related to a category, it will be deleted as well
  item_name: text("item_name").notNull(),
  item_description: text("item_description").default(""),
  item_amount: integer("item_amount").default(0),
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date()),
  updatedAt: timestamp("updated_at").$defaultFn(() => new Date()).$onUpdateFn(() => new Date()),
});

// This table is used to store the types of transactions that can be made on a budget category item i.e. income, expense, etc. (not using enum as users can add their own transaction types)
export const transaction_types = pgTable("transaction_types", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").references(() => users.id, {
    onDelete: "cascade",
  }).notNull(),
  transaction_type: text("transaction_type"),
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date()),
  updatedAt: timestamp("updated_at").$defaultFn(() => new Date()).$onUpdateFn(() => new Date()),
});

// This table is used to store the transactions made and assign them to a budget category item
export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").references(() => users.id, {
    onDelete: "cascade",
  }).notNull(), // when a user is deleted, all their transactions should be deleted as well. Also, we need to store the user id so we can query transactions by user on the frontend to show a list of transaction, irrespective of the budget category item
  budget_id: integer("budget_id").references(() => budgets.id, {
    onDelete: "cascade",
  }), // when a budget is deleted, all its transactions should be deleted as well
  transaction_amount: integer("transaction_amount").notNull(),
  transaction_date: date("transaction_date").notNull(), // date of the transaction (can be different from the created_at date, so we need to store it separately)
  transaction_description: text("transaction_description").default(""),
  transaction_type_id: integer("transaction_type_id").references(
    () => transaction_types.id,
    { onDelete: "set null" },
  ), // when a transaction type is deleted, we should set the transaction type id to null since transactions should still persist
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date()),
  updatedAt: timestamp("updated_at").$defaultFn(() => new Date()).$onUpdateFn(() => new Date()),
});

export const usersRelations = relations(users, ({ many }) => ({
  budgets: many(budgets),
}));

export const budgetsRelations = relations(budgets, ({ one, many }) => ({
  user: one(users, {
    fields: [budgets.user_id],
    references: [users.id],
  }),
  categories: many(budget_categories),
}));

export const budgetCategoriesRelations = relations(
  budget_categories,
  ({ one, many }) => ({
    budget: one(budgets, {
      fields: [budget_categories.budget_id],
      references: [budgets.id],
    }),
    budget_category_items: many(budget_category_items),
  }),
);

export const budgetCategoryItemsRelations = relations(
  budget_category_items,
  ({ one, many }) => ({
    category: one(budget_categories, {
      fields: [budget_category_items.category_id],
      references: [budget_categories.id],
    }),
    transactions: many(transactions), // an item in a category can have N transactions, so we need to establish a one-to-many relationship for N transactions to one item
  }),
);

export const transactionsRelations = relations(
  transactions,
  ({ one }) => ({
    budget: one(budgets, {
      fields: [transactions.budget_id],
      references: [budgets.id],
    }),
    transaction_type: one(transaction_types),
  }),
);
