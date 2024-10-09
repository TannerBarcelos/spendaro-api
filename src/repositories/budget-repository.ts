import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";

import { and, eq } from "drizzle-orm";

import type {
  TBudgetCategory,
  TBudgetCategoryItem,
  TBudgetCategoryItemResult,
  TBudgetCategoryResult,
  TBudgetResult,
  TInsertBudget,
  TTransaction,
  TTransactionResult,
  TTransactionType,
  TTransactionTypeResult,
  TUpdateBudget,
  TUpdateBudgetCategory,
  TUpdateBudgetCategoryItem,
  TUpdateTransaction,
  TUpdateTransactionType,
} from "../db/types.js";

import * as schema from "../db/schema.js";

type TCommonBudgetResponse = Promise<TBudgetResult>;
type TCommonBudgetCategoryResponse = Promise<TBudgetCategoryResult>;
type TCommonBudgetCategoryItemResponse = Promise<TBudgetCategoryItemResult>;
type TCommonTransactionResponse = Promise<TTransactionResult>;
type TCommonTransactionTypeResponse = Promise<TTransactionTypeResult>;

export interface IBudgetRepository {
  // Budgets
  getBudgets: (user_id: number) => Promise<Array<TBudgetResult>>;
  getBudgetById: (user_id: number, budget_id: number) => TCommonBudgetResponse;
  createBudget: (budget: TInsertBudget) => TCommonBudgetResponse;
  updateBudget: (user_id: number, budget_id: number, budget_to_update: TUpdateBudget) => TCommonBudgetResponse;
  deleteBudget: (user_id: number, budget_id: number) => TCommonBudgetResponse;

  // Budget Categories
  getBudgetCategories: (
    budget_id: number
  ) => Promise<Array<TBudgetCategoryResult>>;
  getBudgetCategoryById: (
    budget_category_id: number,
    category_id: number
  ) => TCommonBudgetCategoryResponse;
  createBudgetCategory: (
    category: TBudgetCategory
  ) => TCommonBudgetCategoryResponse;
  updateBudgetCategory: (
    budget_id: number,
    category_id: number,
    category: TUpdateBudgetCategory
  ) => TCommonBudgetCategoryResponse;
  deleteBudgetCategory: (
    categoryId: number
  ) => TCommonBudgetCategoryResponse;

  // Budget Category Items
  getBudgetCategoryItems: (
    user_id: number,
    budget_id: number,
    category_id: number
  ) => Promise<Array<TBudgetCategoryItemResult>>;
  getBudgetCategoryItemById: (
    user_id: number,
    budget_id: number,
    category_id: number,
    item_id: number
  ) => TCommonBudgetCategoryItemResponse;
  createBudgetCategoryItem: (
    item: TBudgetCategoryItem
  ) => TCommonBudgetCategoryItemResponse;
  updateBudgetCategoryItem: (
    item: TUpdateBudgetCategoryItem
  ) => TCommonBudgetCategoryItemResponse;
  deleteBudgetCategoryItem: (
    user_id: number,
    item_id: number
  ) => TCommonBudgetCategoryItemResponse;
  deleteAllBudgetCategoryItems: (
    user_id: number,
    category_id: number
  ) => TCommonBudgetCategoryItemResponse;

  // Transactions
  getTransactions: (budget_id: number) => Promise<Array<TTransactionResult>>;
  getTransactionById: (
    budget_id: number,
    transaction_id: number
  ) => TCommonTransactionResponse;
  createTransaction: (transaction: TTransaction) => TCommonTransactionResponse;
  updateTransaction: (
    budget_id: number,
    transaction_id: number,
    transaction: TUpdateTransaction
  ) => TCommonTransactionResponse;
  deleteTransaction: (
    budget_id: number,
    transaction_id: number
  ) => TCommonTransactionResponse;

  // Transaction Types (user defined + pre-defined i.e. income, expense, bill, etc.)
  getTransactionTypes: () => Promise<Array<TTransactionTypeResult>>;
  getTransactionTypeById: (
    transaction_type_id: number
  ) => TCommonTransactionTypeResponse;
  createTransactionType: (
    transaction_type: TTransactionType
  ) => TCommonTransactionTypeResponse;
  updateTransactionType: (
    transaction_type: TUpdateTransactionType
  ) => TCommonTransactionTypeResponse;
  deleteTransactionType: (
    transaction_type_id: number
  ) => TCommonTransactionTypeResponse;
}

export class BudgetRepository implements IBudgetRepository {
  private db: PostgresJsDatabase<typeof schema>;

  constructor(db: PostgresJsDatabase<typeof schema>) {
    this.db = db;
  }

  async getBudgets(user_id: number): Promise<Array<TBudgetResult>> {
    return await this.db
      .select()
      .from(schema.budgets)
      .where(eq(schema.budgets.user_id, user_id));
  }

  async getBudgetById(
    user_id: number,
    budget_id: number,
  ): TCommonBudgetResponse {
    const [budget]: Array<TBudgetResult> = await this.db
      .select()
      .from(schema.budgets)
      .where(
        and(
          eq(schema.budgets.id, budget_id),
          eq(schema.budgets.user_id, user_id),
        ),
      );
    return budget;
  }

  async createBudget(budget: TInsertBudget): TCommonBudgetResponse {
    const [newBudget]: Array<TBudgetResult> = await this.db
      .insert(schema.budgets)
      .values(budget)
      .returning();
    return newBudget;
  }

  async updateBudget(user_id: number, budget_id: number, budget_to_update: TUpdateBudget): TCommonBudgetResponse {
    const [updatedBudget]: Array<TBudgetResult> = await this.db
      .update(schema.budgets)
      .set(budget_to_update)
      .where(
        and(
          eq(schema.budgets.id, budget_id),
          eq(schema.budgets.user_id, user_id),
        ),
      )
      .returning();
    return updatedBudget;
  }

  async deleteBudget(
    user_id: number,
    budget_id: number,
  ): TCommonBudgetResponse {
    const [deletedBudget]: Array<TBudgetResult> = await this.db
      .delete(schema.budgets)
      .where(
        and(
          eq(schema.budgets.id, budget_id),
          eq(schema.budgets.user_id, user_id),
        ),
      )
      .returning();
    return deletedBudget;
  }

  async getBudgetCategories(
    budget_id: number,
  ): Promise<Array<TBudgetCategoryResult>> {
    return await this.db
      .select()
      .from(schema.budget_categories)
      .where(eq(schema.budget_categories.budget_id, budget_id));
  }

  async getBudgetCategoryById(
    budget_id: number,
    cateogry_id: number,
  ): TCommonBudgetCategoryResponse {
    const [category]: Array<TBudgetCategoryResult> = await this.db
      .select()
      .from(schema.budget_categories)
      .where(and(eq(schema.budget_categories.id, cateogry_id), eq(schema.budget_categories.budget_id, budget_id)));
    return category;
  }

  async createBudgetCategory(
    category: TBudgetCategory,
  ): TCommonBudgetCategoryResponse {
    const [newCategory]: Array<TBudgetCategoryResult> = await this.db
      .insert(schema.budget_categories)
      .values(category)
      .returning();
    return newCategory;
  }

  async updateBudgetCategory(
    budget_id: number,
    category_id: number,
    category_to_update: TUpdateBudgetCategory,
  ): TCommonBudgetCategoryResponse {
    const [updatedCategory]: Array<TBudgetCategoryResult> = await this.db
      .update(schema.budget_categories)
      .set(category_to_update)
      .where(and(eq(schema.budget_categories.id, category_id), eq(schema.budget_categories.budget_id, budget_id)))
      .returning();
    return updatedCategory;
  }

  async deleteBudgetCategory(
    category_id: number,
  ): TCommonBudgetCategoryResponse {
    const [deletedCategory]: Array<TBudgetCategoryResult> = await this.db
      .delete(schema.budget_categories)
      .where(eq(schema.budget_categories.id, category_id))
      .returning();
    return deletedCategory;
  }

  async getBudgetCategoryItems(
    category_id: number,
  ): Promise<Array<TBudgetCategoryItemResult>> {
    return await this.db
      .select()
      .from(schema.budget_category_items)
      .where(eq(schema.budget_category_items.category_id, category_id));
  }

  async getBudgetCategoryItemById(
    itemId: number,
  ): TCommonBudgetCategoryItemResponse {
    const [item]: Array<TBudgetCategoryItemResult> = await this.db
      .select()
      .from(schema.budget_category_items)
      .where(eq(schema.budget_category_items.id, itemId));
    return item;
  }

  async createBudgetCategoryItem(
    item: TBudgetCategoryItem,
  ): TCommonBudgetCategoryItemResponse {
    const [newItem]: Array<TBudgetCategoryItemResult> = await this.db
      .insert(schema.budget_category_items)
      .values(item)
      .returning();
    return newItem;
  }

  async updateBudgetCategoryItem(
    item: TBudgetCategoryItem,
  ): TCommonBudgetCategoryItemResponse {
    const [updatedItem]: Array<TBudgetCategoryItemResult> = await this.db
      .update(schema.budget_category_items)
      .set(item)
      .where(eq(schema.budget_category_items.id, item.id!))
      .returning();
    return updatedItem;
  }

  async deleteBudgetCategoryItem(
    itemId: number,
  ): TCommonBudgetCategoryItemResponse {
    const [deletedItem]: Array<TBudgetCategoryItemResult> = await this.db
      .delete(schema.budget_category_items)
      .where(eq(schema.budget_category_items.id, itemId))
      .returning();
    return deletedItem;
  }

  async deleteAllBudgetCategoryItems(
    categoryId: number,
  ): TCommonBudgetCategoryItemResponse {
    const [deletedItems]: Array<TBudgetCategoryItemResult> = await this.db
      .delete(schema.budget_category_items)
      .where(eq(schema.budget_category_items.category_id, categoryId))
      .returning();
    return deletedItems;
  }

  async getTransactions(budget_id: number): Promise<Array<TTransactionResult>> {
    return await this.db
      .select()
      .from(schema.transactions)
      .where(eq(schema.transactions.budget_id, budget_id));
  }

  async getTransactionById(transactionId: number): TCommonTransactionResponse {
    const [transaction]: Array<TTransactionResult> = await this.db
      .select()
      .from(schema.transactions)
      .where(eq(schema.transactions.id, transactionId));
    return transaction;
  }

  async createTransaction(
    transaction: TTransaction,
  ): TCommonTransactionResponse {
    const [newTransaction]: Array<TTransactionResult> = await this.db
      .insert(schema.transactions)
      .values(transaction)
      .returning();
    return newTransaction;
  }

  async updateTransaction(
    budget_id: number,
    transaction_id: number,
    transaction: TTransaction,
  ): TCommonTransactionResponse {
    const [updatedTransaction]: Array<TTransactionResult> = await this.db
      .update(schema.transactions)
      .set(transaction)
      .where(
        and(
          eq(schema.transactions.id, transaction_id),
          eq(schema.transactions.budget_id, budget_id),
        ),
      )
      .returning();
    return updatedTransaction;
  }

  async deleteTransaction(transaction_id: number): TCommonTransactionResponse {
    const [deletedTransaction]: Array<TTransactionResult> = await this.db
      .delete(schema.transactions)
      .where(eq(schema.transactions.id, transaction_id))
      .returning();
    return deletedTransaction;
  }

  async getTransactionTypes(): Promise<Array<TTransactionTypeResult>> {
    return await this.db.select().from(schema.transaction_types);
  }

  async getTransactionTypeById(
    transaction: number,
  ): TCommonTransactionTypeResponse {
    const [transactionType]: Array<TTransactionTypeResult> = await this.db
      .select()
      .from(schema.transaction_types)
      .where(eq(schema.transaction_types.id, transaction));
    return transactionType;
  }

  async createTransactionType(
    transaction: TTransactionType,
  ): TCommonTransactionTypeResponse {
    const [newTransactionType]: Array<TTransactionTypeResult> = await this.db
      .insert(schema.transaction_types)
      .values(transaction)
      .returning();
    return newTransactionType;
  }

  async updateTransactionType(
    transaction: TTransactionType,
  ): TCommonTransactionTypeResponse {
    const [updatedTransactionType]: Array<TTransactionTypeResult>
      = await this.db
        .update(schema.transaction_types)
        .set(transaction)
        .where(eq(schema.transaction_types.id, transaction.id!))
        .returning();
    return updatedTransactionType;
  }

  async deleteTransactionType(
    transactionId: number,
  ): TCommonTransactionTypeResponse {
    const [deletedTransactionType]: Array<TTransactionTypeResult>
      = await this.db
        .delete(schema.transaction_types)
        .where(eq(schema.transaction_types.id, transactionId))
        .returning();
    return deletedTransactionType;
  }
}
