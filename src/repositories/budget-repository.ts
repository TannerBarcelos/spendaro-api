import * as schema from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { TBudgetResult, TBudgetCategoryResult, TBudgetCategoryItemResult, TTransactionResult, TTransactionTypeResult, TBudget, TBudgetCategory, TBudgetCategoryItem, TTransaction, TTransactionType } from "@/lib/types";

type TCommonBudgetResponse = Promise<TBudgetResult>;
type TCommonBudgetCategoryResponse = Promise<TBudgetCategoryResult>;
type TCommonBudgetCategoryItemResponse = Promise<TBudgetCategoryItemResult>;
type TCommonTransactionResponse = Promise<TTransactionResult>;
type TCommonTransactionTypeResponse = Promise<TTransactionTypeResult>;

interface IBudgetRepository {
  // Budgets
  getBudgets(user_id: number): Promise<Array<TBudgetResult>>;
  getBudgetById(user_id:number, budget_id: number): TCommonBudgetResponse;
  createBudget(budget: TBudget): TCommonBudgetResponse;
  updateBudget(budget: TBudget): TCommonBudgetResponse;
  deleteBudget(budget_id: number): TCommonBudgetResponse;

  // Budget Categories
  getBudgetCategories(budget_id: number): Promise<Array<TBudgetCategoryResult>>;
  getBudgetCategoryById(category_id: number): TCommonBudgetCategoryResponse;
  createBudgetCategory(
    category: TBudgetCategory
  ): TCommonBudgetCategoryResponse;
  updateBudgetCategory(
    category: TBudgetCategory
  ): TCommonBudgetCategoryResponse;
  deleteBudgetCategory(categoryId: number): TCommonBudgetCategoryResponse;

  // Budget Category Items
  getBudgetCategoryItems(
    category_id: number
  ): Promise<Array<TBudgetCategoryItemResult>>;
  getBudgetCategoryItemById(item_id: number): TCommonBudgetCategoryItemResponse;
  createBudgetCategoryItem(
    item: TBudgetCategoryItem
  ): TCommonBudgetCategoryItemResponse;
  updateBudgetCategoryItem(
    item: TBudgetCategoryItem
  ): TCommonBudgetCategoryItemResponse;
  deleteBudgetCategoryItem(item_id: number): TCommonBudgetCategoryItemResponse;
  deleteAllBudgetCategoryItems(
    category_id: number
  ): TCommonBudgetCategoryItemResponse;

  // Transactions
  getTransactions(item_id: number): Promise<Array<TTransactionResult>>;
  getTransactionById(transaction_id: number): TCommonTransactionResponse;
  createTransaction(transaction: TTransaction): TCommonTransactionResponse;
  updateTransaction(transaction: TTransaction): TCommonTransactionResponse;
  deleteTransaction(transaction_id: number): TCommonTransactionResponse;

  // Transaction Types (user defined + pre-defined i.e. income, expense, bill, etc.)
  getTransactionTypes(): Promise<Array<TTransactionTypeResult>>;
  getTransactionTypeById(
    transaction_type_id: number
  ): TCommonTransactionTypeResponse;
  createTransactionType(
    transaction_type: TTransactionType
  ): TCommonTransactionTypeResponse;
  updateTransactionType(
    transaction_type: TTransactionType
  ): TCommonTransactionTypeResponse;
  deleteTransactionType(
    transaction_type_id: number
  ): TCommonTransactionTypeResponse;
}

class BudgetRepository implements IBudgetRepository {
  private db: PostgresJsDatabase<schema.SpendaroSchema>;

  constructor(db: PostgresJsDatabase<schema.SpendaroSchema>) {
    this.db = db;
  }

  async getBudgets(user_id: number): Promise<Array<TBudgetResult>> {
    return await this.db
      .select()
      .from(schema.budgets)
      .where(eq(schema.budgets.user_id, user_id));
  }

  async getBudgetById(user_id: number, budget_id: number): TCommonBudgetResponse {
    const [budget]: Array<TBudgetResult> = await this.db
      .select()
      .from(schema.budgets)
      .where(and(eq(schema.budgets.id, budget_id), eq(schema.budgets.user_id, user_id)));
    return budget;
  }

  async createBudget(budget: TBudget): TCommonBudgetResponse {
    const [newBudget]: Array<TBudgetResult> = await this.db
      .insert(schema.budgets)
      .values(budget)
      .returning();
    return newBudget;
  }

  async updateBudget(
    budget: TBudget
  ): TCommonBudgetResponse {
    const [updatedBudget]: Array<TBudgetResult> = await this.db
      .update(schema.budgets)
      .set(budget)
      .where(and(eq(schema.budgets.id, budget.id!), eq(schema.budgets.user_id, budget.user_id!)))
      .returning();
    return updatedBudget;
  }

  async deleteBudget(budget_id: number): TCommonBudgetResponse {
    const [deletedBudget]: Array<TBudgetResult> = await this.db
      .delete(schema.budgets)
      .where(eq(schema.budgets.id, budget_id))
      .returning();
    return deletedBudget;
  }

  async getBudgetCategories(
    budget_id: number
  ): Promise<Array<TBudgetCategoryResult>> {
    return await this.db
      .select()
      .from(schema.budget_categories)
      .where(eq(schema.budget_categories.budget_id, budget_id));
  }

  async getBudgetCategoryById(
    categoryId: number
  ): TCommonBudgetCategoryResponse {
    const [category]: Array<TBudgetCategoryResult> = await this.db
      .select()
      .from(schema.budget_categories)
      .where(eq(schema.budget_categories.id, categoryId));
    return category;
  }

  async createBudgetCategory(
    category: TBudgetCategory
  ): TCommonBudgetCategoryResponse {
    const [newCategory]: Array<TBudgetCategoryResult> = await this.db
      .insert(schema.budget_categories)
      .values(category)
      .returning();
    return newCategory;
  }

  async updateBudgetCategory(
    category: TBudgetCategory
  ): TCommonBudgetCategoryResponse {
    const [updatedCategory]: Array<TBudgetCategoryResult> = await this.db
      .update(schema.budget_categories)
      .set(category)
      .where(eq(schema.budget_categories.id, category.id!))
      .returning();
    return updatedCategory;
  }

  async deleteBudgetCategory(
    categoryId: number
  ): TCommonBudgetCategoryResponse {
    const [deletedCategory]: Array<TBudgetCategoryResult> = await this.db
      .delete(schema.budget_categories)
      .where(eq(schema.budget_categories.id, categoryId))
      .returning();
    return deletedCategory;
  }

  async getBudgetCategoryItems(
    category_id: number
  ): Promise<Array<TBudgetCategoryItemResult>> {
    return await this.db
      .select()
      .from(schema.budget_category_items)
      .where(eq(schema.budget_category_items.category_id, category_id));
  }

  async getBudgetCategoryItemById(
    itemId: number
  ): TCommonBudgetCategoryItemResponse {
    const [item]: Array<TBudgetCategoryItemResult> = await this.db
      .select()
      .from(schema.budget_category_items)
      .where(eq(schema.budget_category_items.id, itemId));
    return item;
  }

  async createBudgetCategoryItem(
    item: TBudgetCategoryItem
  ): TCommonBudgetCategoryItemResponse {
    const [newItem]: Array<TBudgetCategoryItemResult> = await this.db
      .insert(schema.budget_category_items)
      .values(item)
      .returning();
    return newItem;
  }

  async updateBudgetCategoryItem(
    item: TBudgetCategoryItem
  ): TCommonBudgetCategoryItemResponse {
    const [updatedItem]: Array<TBudgetCategoryItemResult> = await this.db
      .update(schema.budget_category_items)
      .set(item)
      .where(eq(schema.budget_category_items.id, item.id!))
      .returning();
    return updatedItem;
  }

  async deleteBudgetCategoryItem(
    itemId: number
  ): TCommonBudgetCategoryItemResponse {
    const [deletedItem]: Array<TBudgetCategoryItemResult> = await this.db
      .delete(schema.budget_category_items)
      .where(eq(schema.budget_category_items.id, itemId))
      .returning();
    return deletedItem;
  }

  async deleteAllBudgetCategoryItems(
    categoryId: number
  ): TCommonBudgetCategoryItemResponse {
    const [deletedItems]: Array<TBudgetCategoryItemResult> = await this.db
      .delete(schema.budget_category_items)
      .where(eq(schema.budget_category_items.category_id, categoryId))
      .returning();
    return deletedItems;
  }

  async getTransactions(itemId: number): Promise<Array<TTransactionResult>> {
    return await this.db
      .select()
      .from(schema.transactions)
      .where(eq(schema.transactions.item_id, itemId));
  }

  async getTransactionById(transactionId: number): TCommonTransactionResponse {
    const [transaction]: Array<TTransactionResult> = await this.db
      .select()
      .from(schema.transactions)
      .where(eq(schema.transactions.id, transactionId));
    return transaction;
  }

  async createTransaction(
    transaction: TTransaction
  ): TCommonTransactionResponse {
    const [newTransaction]: Array<TTransactionResult> = await this.db
      .insert(schema.transactions)
      .values(transaction)
      .returning();
    return newTransaction;
  }

  async updateTransaction(
    transaction: TTransaction
  ): TCommonTransactionResponse {
    const [updatedTransaction]: Array<TTransactionResult> = await this.db
      .update(schema.transactions)
      .set(transaction)
      .where(eq(schema.transactions.id, transaction.id!))
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
    transaction: number
  ): TCommonTransactionTypeResponse {
    const [transactionType]: Array<TTransactionTypeResult> = await this.db
      .select()
      .from(schema.transaction_types)
      .where(eq(schema.transaction_types.id, transaction));
    return transactionType;
  }

  async createTransactionType(
    transaction: TTransactionType
  ): TCommonTransactionTypeResponse {
    const [newTransactionType]: Array<TTransactionTypeResult> = await this.db
      .insert(schema.transaction_types)
      .values(transaction)
      .returning();
    return newTransactionType;
  }

  async updateTransactionType(
    transaction: TTransactionType
  ): TCommonTransactionTypeResponse {
    const [updatedTransactionType]: Array<TTransactionTypeResult> =
      await this.db
        .update(schema.transaction_types)
        .set(transaction)
        .where(eq(schema.transaction_types.id, transaction.id!))
        .returning();
    return updatedTransactionType;
  }

  async deleteTransactionType(
    transactionId: number
  ): TCommonTransactionTypeResponse {
    const [deletedTransactionType]: Array<TTransactionTypeResult> =
      await this.db
        .delete(schema.transaction_types)
        .where(eq(schema.transaction_types.id, transactionId))
        .returning();
    return deletedTransactionType;
  }
}

export { IBudgetRepository, BudgetRepository };
