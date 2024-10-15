import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";

import { and, eq } from "drizzle-orm";

import type { TBudgetCategoryItemResult, TBudgetCategoryItemToCreate, TBudgetCategoryItemToUpdate, TBudgetCategoryResult, TBudgetCategoryToCreate, TBudgetCategoryToUpdate, TBudgetResult, TBudgetToCreate, TBudgetToUpdate, TTransactionResult, TTransactionToCreate, TTransactionToUpdate, TTransactionTypeResult, TTransactionTypeToCreate, TTransactionTypeToUpdate } from "@/handlers/budget/budget-schemas";

import * as schema from "@/db/schema";

type TCommonBudgetResponse = Promise<TBudgetResult>;
type TCommonBudgetCategoryResponse = Promise<TBudgetCategoryResult>;
type TCommonBudgetCategoryItemResponse = Promise<TBudgetCategoryItemResult>;
type TCommonTransactionResponse = Promise<TTransactionResult>;
type TCommonTransactionTypeResponse = Promise<TTransactionTypeResult>;

export interface IBudgetRepository {
  getBudgets: (user_id: number) => Promise<Array<TBudgetResult>>;
  getBudgetById: (user_id: number, budget_id: number) => TCommonBudgetResponse;
  createBudget: (budget: TBudgetToCreate) => TCommonBudgetResponse;
  updateBudget: (user_id: number, budget_id: number, budget_to_update: TBudgetToUpdate) => TCommonBudgetResponse;
  deleteBudget: (user_id: number, budget_id: number) => TCommonBudgetResponse;
  getBudgetCategories: (budget_id: number) => Promise<Array<TBudgetCategoryResult>>;
  getBudgetCategoryById: (budget_category_id: number, category_id: number) => TCommonBudgetCategoryResponse;
  createBudgetCategory: (category: TBudgetCategoryToCreate) => TCommonBudgetCategoryResponse;
  updateBudgetCategory: (budget_id: number, category_id: number, category: TBudgetCategoryToUpdate) => TCommonBudgetCategoryResponse;
  deleteBudgetCategory: (budget_id: number, categoryId: number) => TCommonBudgetCategoryResponse;
  getBudgetCategoryItems: (budget_id: number, category_id: number) => Promise<Array<TBudgetCategoryItemResult>>;
  getBudgetCategoryItemById: (category_id: number, item_id: number) => TCommonBudgetCategoryItemResponse;
  createBudgetCategoryItem: (item: TBudgetCategoryItemToCreate) => TCommonBudgetCategoryItemResponse;
  updateBudgetCategoryItem: (item_id: number, item: TBudgetCategoryItemToUpdate) => TCommonBudgetCategoryItemResponse;
  deleteBudgetCategoryItem: (item_id: number) => TCommonBudgetCategoryItemResponse;
  deleteAllBudgetCategoryItems: (category_id: number) => Promise<TBudgetCategoryItemResult[]>;
  getTransactions: (budget_id: number) => Promise<Array<TTransactionResult>>;
  getTransactionById: (budget_id: number, transaction_id: number) => TCommonTransactionResponse;
  createTransaction: (transaction: TTransactionToCreate) => TCommonTransactionResponse;
  updateTransaction: (budget_id: number, transaction_id: number, transaction: TTransactionToUpdate) => TCommonTransactionResponse;
  deleteTransaction: (budget_id: number, transaction_id: number) => TCommonTransactionResponse;
  getTransactionTypes: (budget_id: number) => Promise<Array<TTransactionTypeResult>>;
  getTransactionTypeById: (budget_id: number, transaction_type_id: number) => TCommonTransactionTypeResponse;
  createTransactionType: (transaction_type: TTransactionTypeToCreate) => TCommonTransactionTypeResponse;
  updateTransactionType: (budget_id: number, type_id: number, transaction_type: TTransactionTypeToUpdate) => TCommonTransactionTypeResponse;
  deleteTransactionType: (budget_id: number, transaction_type_id: number) => TCommonTransactionTypeResponse;
}

export class BudgetRepository implements IBudgetRepository {
  constructor(private db: PostgresJsDatabase<typeof schema>) {
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

  async createBudget(budget: TBudgetToCreate): TCommonBudgetResponse {
    const [newBudget]: Array<TBudgetResult> = await this.db
      .insert(schema.budgets)
      .values(budget)
      .returning();
    return newBudget;
  }

  async updateBudget(user_id: number, budget_id: number, budget_to_update: TBudgetToUpdate): TCommonBudgetResponse {
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
      .where(
        eq(schema.budget_categories.budget_id, budget_id),
        // no need to use user_id because budget categories are unique to a budget and cannot exist without a budget (witheld by the constraints)
      );
  }

  async getBudgetCategoryById(
    budget_id: number,
    category_id: number,
  ): TCommonBudgetCategoryResponse {
    const [category]: Array<TBudgetCategoryResult> = await this.db
      .select()
      .from(schema.budget_categories)
      .where(and(
        eq(schema.budget_categories.id, category_id),
        eq(schema.budget_categories.budget_id, budget_id),
      ));
    return category;
  }

  async createBudgetCategory(
    category: TBudgetCategoryToCreate,
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
    category_to_update: TBudgetCategoryToUpdate,
  ): TCommonBudgetCategoryResponse {
    const [updatedCategory]: Array<TBudgetCategoryResult> = await this.db
      .update(schema.budget_categories)
      .set(category_to_update)
      .where(
        and(
          eq(schema.budget_categories.id, category_id),
          eq(schema.budget_categories.budget_id, budget_id),
        ),
      )
      .returning();
    return updatedCategory;
  }

  async deleteBudgetCategory(
    budget_id: number,
    category_id: number,
  ): TCommonBudgetCategoryResponse {
    const [deletedCategory]: Array<TBudgetCategoryResult> = await this.db
      .delete(schema.budget_categories)
      .where(and(
        eq(schema.budget_categories.id, category_id),
        eq(schema.budget_categories.budget_id, budget_id),
      ))
      .returning();
    return deletedCategory;
  }

  async getBudgetCategoryItems(
    budget_id: number,
    category_id: number,
  ): Promise<Array<TBudgetCategoryItemResult>> {
    return await this.db
      .select()
      .from(schema.budget_category_items)
      .where(
        and(
          eq(schema.budget_category_items.category_id, category_id),
          eq(schema.budget_category_items.budget_id, budget_id),
        ),
      );
  }

  async getBudgetCategoryItemById(
    category_id: number,
    item_id: number,
  ): TCommonBudgetCategoryItemResponse {
    const [item]: Array<TBudgetCategoryItemResult> = await this.db
      .select()
      .from(schema.budget_category_items)
      .where(
        and(
          eq(schema.budget_category_items.id, item_id),
          eq(schema.budget_category_items.category_id, category_id),
        ),
      );
    return item;
  }

  async createBudgetCategoryItem(
    item: TBudgetCategoryItemToCreate,
  ): TCommonBudgetCategoryItemResponse {
    const [newItem]: Array<TBudgetCategoryItemResult> = await this.db
      .insert(schema.budget_category_items)
      .values(item)
      .returning();
    return newItem;
  }

  async updateBudgetCategoryItem(
    item_id: number,
    item: TBudgetCategoryItemToUpdate,
  ): TCommonBudgetCategoryItemResponse {
    const [updatedItem]: Array<TBudgetCategoryItemResult> = await this.db
      .update(schema.budget_category_items)
      .set(item)
      .where(eq(schema.budget_category_items.id, item_id))
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
  ): Promise<TBudgetCategoryItemResult[]> {
    const deletedItems = await this.db
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

  async getTransactionById(budget_id: number, transactionId: number): TCommonTransactionResponse {
    const [transaction]: Array<TTransactionResult> = await this.db
      .select()
      .from(schema.transactions)
      .where(and(
        eq(schema.transactions.id, transactionId),
        eq(schema.transactions.budget_id, budget_id),
      ));
    return transaction;
  }

  async createTransaction(
    transaction: TTransactionToCreate,
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
    transaction: TTransactionToUpdate,
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

  async deleteTransaction(budget_id: number, transaction_id: number): TCommonTransactionResponse {
    const [deletedTransaction]: Array<TTransactionResult> = await this.db
      .delete(schema.transactions)
      .where(
        and(
          eq(schema.transactions.id, transaction_id),
          eq(schema.transactions.budget_id, budget_id),
        ),
      )
      .returning();
    return deletedTransaction;
  }

  async getTransactionTypes(budget_id: number): Promise<Array<TTransactionTypeResult>> {
    return await this.db.select().from(schema.transaction_types).where(eq(schema.transaction_types.budget_id, budget_id));
  }

  async getTransactionTypeById(
    budget_id: number,
    transaction_type_id: number,
  ): TCommonTransactionTypeResponse {
    const [transactionType]: Array<TTransactionTypeResult> = await this.db
      .select()
      .from(schema.transaction_types)
      .where(and(
        eq(schema.transaction_types.id, transaction_type_id),
        eq(schema.transaction_types.budget_id, budget_id),
      ));
    return transactionType;
  }

  async createTransactionType(
    transaction: TTransactionTypeToCreate,
  ): TCommonTransactionTypeResponse {
    const [newTransactionType]: Array<TTransactionTypeResult> = await this.db
      .insert(schema.transaction_types)
      .values(transaction)
      .returning();
    return newTransactionType;
  }

  async updateTransactionType(
    budget_id: number,
    type_id: number,
    type: TTransactionTypeToUpdate,
  ): TCommonTransactionTypeResponse {
    const [updatedTransactionType]: Array<TTransactionTypeResult>
      = await this.db
        .update(schema.transaction_types)
        .set(type)
        .where(and(
          eq(schema.transaction_types.id, type_id),
          eq(schema.transaction_types.budget_id, budget_id),
        ))
        .returning();
    return updatedTransactionType;
  }

  async deleteTransactionType(
    budget_id: number,
    type_id: number,
  ): TCommonTransactionTypeResponse {
    const [updatedTransactionType]: Array<TTransactionTypeResult>
      = await this.db
        .delete(schema.transaction_types)
        .where(and(
          eq(schema.transaction_types.id, type_id),
          eq(schema.transaction_types.budget_id, budget_id),
        ))
        .returning();
    return updatedTransactionType;
  }
}
