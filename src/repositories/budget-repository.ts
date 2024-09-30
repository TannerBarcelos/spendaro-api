import {
  budgets,
  SpendaroSchema,
  TBudget,
  TBudgetCategoryItemResult,
  TBudgetCategoryResult,
  TBudgetResult,
  transactions,
  TTransactionResult,
  TTransactionTypeResult,
} from '@/db/schema';
import { eq } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

type TCommonBudgetResponse = Promise<TBudgetResult>;
type TCommonBudgetCategoryResponse = Promise<TBudgetCategoryResult>;
type TCommonBudgetCategoryItemResponse = Promise<TBudgetCategoryItemResult>;
type TCommonTransactionResponse = Promise<TTransactionResult>;
type TCommonTransactionTypeResponse = Promise<TTransactionTypeResult>;

interface IBudgetRepository {
  // Budgets
  getBudgets(userId: number): Array<TCommonBudgetResponse>;
  getBudgetById(budgetId: number): TCommonBudgetResponse;
  createBudget(budget: TBudget): TCommonBudgetResponse;
  updateBudget(budget: TBudget): TCommonBudgetResponse;
  deleteBudget(budgetId: number): TCommonBudgetResponse;

  // Budget Categories
  getBudgetCategories(budgetId: number): Array<TCommonBudgetCategoryResponse>;
  getBudgetCategoryById(categoryId: number): TCommonBudgetCategoryResponse;
  createBudgetCategory(category: TBudget): TCommonBudgetCategoryResponse;
  updateBudgetCategory(category: TBudget): TCommonBudgetCategoryResponse;
  deleteBudgetCategory(categoryId: number): TCommonBudgetCategoryResponse;

  // Budget Category Items
  getBudgetCategoryItems(
    categoryId: number
  ): Array<TCommonBudgetCategoryItemResponse>;
  getBudgetCategoryItemById(itemId: number): TCommonBudgetCategoryItemResponse;
  createBudgetCategoryItem(item: TBudget): TCommonBudgetCategoryItemResponse;
  updateBudgetCategoryItem(item: TBudget): TCommonBudgetCategoryItemResponse;
  deleteBudgetCategoryItem(itemId: number): TCommonBudgetCategoryItemResponse;
  deleteAllBudgetCategoryItems(
    categoryId: number
  ): TCommonBudgetCategoryItemResponse;

  // Transactions
  getTransactions(itemId: number): Array<TCommonTransactionResponse>;
  getTransactionById(transactionId: number): TCommonTransactionResponse;
  createTransaction(transaction: TBudget): TCommonTransactionResponse;
  updateTransaction(transaction: TBudget): TCommonTransactionResponse;
  deleteTransaction(transactionId: number): TCommonTransactionResponse;

  // Transaction Types (user defined + pre-defined i.e. income, expense, bill, etc.)
  getTransactionTypes(): Array<TCommonTransactionTypeResponse>;
  getTransactionTypeById(transaction: number): TCommonTransactionTypeResponse;
  createTransactionType(transaction: TBudget): TCommonTransactionTypeResponse;
  updateTransactionType(transaction: TBudget): TCommonTransactionTypeResponse;
  deleteTransactionType(transactionId: number): TCommonTransactionTypeResponse;
}

class BudgetRepository implements IBudgetRepository {
  private db: PostgresJsDatabase<SpendaroSchema>;

  constructor(db: PostgresJsDatabase<SpendaroSchema>) {
    this.db = db;
  }

  // Budgets
  async getBudgets(userId: number): Array<TCommonBudgetResponse> {
    const budgets: Array<TBudgetResult> = await this.db
      .select()
      .from(budgets)
      .where(eq(budgets.userId, userId));
    return budgets;
  }

  async getBudgetById(budgetId: number): TCommonBudgetResponse {
    const [budget]: Array<TBudgetResult> = await this.db
      .select()
      .from(budgets)
      .where(eq(budgets.id, budgetId));
    return budget;
  }

  async createBudget(budget: TBudget): TCommonBudgetResponse {
    const [newBudget]: Array<TBudgetResult> = await this.db
      .insert(budgets)
      .values({
        userId: budget.userId,
        name: budget.name,
        description: budget.description,
        startDate: budget.startDate,
        endDate: budget.endDate,
      })
      .returning();
    return newBudget;
  }

  async updateBudget(budget: TBudget): TCommonBudgetResponse {
    const [updatedBudget]: Array<TBudgetResult> = await this.db
      .update(budgets)
      .set({
        name: budget.name,
        description: budget.description,
        startDate: budget.startDate,
        endDate: budget.endDate,
      })
      .where(eq(budgets.id, budget.id))
      .returning();
    return updatedBudget;
  }

  async deleteBudget(budgetId: number): TCommonBudgetResponse {
    const [deletedBudget]: Array<TBudgetResult> = await this.db
      .delete()
      .from(budgets)
      .where(eq(budgets.id, budgetId))
      .returning();
    return deletedBudget;
  }

  // Budget Categories
  async getBudgetCategories(
    budgetId: number
  ): Array<TCommonBudgetCategoryResponse> {
    const categories: Array<TBudgetCategoryResult> = await this.db
      .select()
      .from(budgetCategories)
      .where(eq(budgetCategories.budgetId, budgetId));
    return categories;
  }

  async getBudgetCategoryById(
    categoryId: number
  ): TCommonBudgetCategoryResponse {
    const [category]: Array<TBudgetCategoryResult> = await this.db
      .select()
      .from(budgetCategories)
      .where(eq(budgetCategories.id, categoryId));
    return category;
  }

  async createBudgetCategory(category: TBudget): TCommonBudgetCategoryResponse {
    const [newCategory]: Array<TBudgetCategoryResult> = await this.db
      .insert(budgetCategories)
      .values({
        budgetId: category.budgetId,
        name: category.name,
        description: category.description,
      })
      .returning();
    return newCategory;
  }

  async updateBudgetCategory(category: TBudget): TCommonBudgetCategoryResponse {
    const [updatedCategory]: Array<TBudgetCategoryResult> = await this.db
      .update(budgetCategories)
      .set({
        name: category.name,
        description: category.description,
      })
      .where(eq(budgetCategories.id, category.id))
      .returning();
    return updatedCategory;
  }

  async deleteBudgetCategory(
    categoryId: number
  ): TCommonBudgetCategoryResponse {
    const [deletedCategory]: Array<TBudgetCategoryResult> = await this.db
      .delete()
      .from(budgetCategories)
      .where(eq(budgetCategories.id, categoryId))
      .returning();
    return deletedCategory;
  }

  // Budget Category Items
  async getBudgetCategoryItems(
    categoryId: number
  ): Array<TCommonBudgetCategoryItemResponse> {
    const items: Array<TBudgetCategoryItemResult> = await this.db
      .select()
      .from(budgetCategoryItems)
      .where(eq(budgetCategoryItems.categoryId, categoryId));
    return items;
  }

  async getBudgetCategoryItemById(
    itemId: number
  ): TCommonBudgetCategoryItemResponse {
    const [item]: Array<TBudgetCategoryItemResult> = await this.db
      .select()
      .from(budgetCategoryItems)
      .where(eq(budgetCategoryItems.id, itemId));
    return item;
  }

  async createBudgetCategoryItem(
    item: TBudget
  ): TCommonBudgetCategoryItemResponse {
    const [newItem]: Array<TBudgetCategoryItemResult> = await this.db
      .insert(budgetCategoryItems)
      .values({
        categoryId: item.categoryId,
        name: item.name,
        description: item.description,
        amount: item.amount,
        transactionDate: item.transactionDate,
      })
      .returning();
    return newItem;
  }

  async updateBudgetCategoryItem(
    item: TBudget
  ): TCommonBudgetCategoryItemResponse {
    const [updatedItem]: Array<TBudgetCategoryItemResult> = await this.db
      .update(budgetCategoryItems)
      .set({
        name: item.name,
        description: item.description,
        amount: item.amount,
        transactionDate: item.transactionDate,
      })
      .where(eq(budgetCategoryItems.id, item.id))
      .returning();
    return updatedItem;
  }

  async deleteBudgetCategoryItem(
    itemId: number
  ): TCommonBudgetCategoryItemResponse {
    const [deletedItem]: Array<TBudgetCategoryItemResult> = await this.db
      .delete()
      .from(budgetCategoryItems)
      .where(eq(budgetCategoryItems.id, itemId))
      .returning();
    return deletedItem;
  }

  async deleteAllBudgetCategoryItems(
    categoryId: number
  ): TCommonBudgetCategoryItemResponse {
    const [deletedItems]: Array<TBudgetCategoryItemResult> = await this.db
      .delete()
      .from(budgetCategoryItems)
      .where(eq(budgetCategoryItems.categoryId, categoryId))
      .returning();
    return deletedItems;
  }

  // Transactions
  async getTransactions(itemId: number): Array<TCommonTransactionResponse> {
    const transactions: Array<TTransactionResult> = await this.db
      .select()
      .from(transactions)
      .where(eq(transactions.itemId, itemId));
    return transactions;
  }

  async getTransactionById(transactionId: number): TCommonTransactionResponse {
    const [transaction]: Array<TTransactionResult> = await this.db
      .select()
      .from(transactions)
      .where(eq(transactions.id, transactionId));
    return transaction;
  }

  async createTransaction(transaction: TBudget): TCommonTransactionResponse {
    const [newTransaction]: Array<TTransactionResult> = await this.db
      .insert(transactions)
      .values({
        itemId: transaction.itemId,
        transactionTypeId: transaction.transactionTypeId,
        amount: transaction.amount,
        transactionDate: transaction.transactionDate,
      })
      .returning();
    return newTransaction;
  }

  async updateTransaction(transaction: TBudget): TCommonTransactionResponse {
    const [updatedTransaction]: Array<TTransactionResult> = await this.db
      .update(transactions)
      .set({
        transactionTypeId: transaction.transactionTypeId,
        amount: transaction.amount,
        transactionDate: transaction.transactionDate,
      })
      .where(eq(transactions.id, transaction.id))
      .returning();
    return updatedTransaction;
  }

  async deleteTransaction(transactionId: number): TCommonTransactionResponse {
    const [deletedTransaction]: Array<TTransactionResult> = await this.db
      .delete()
      .from(transactions)
      .where(eq(transactions.id, transactionId))
      .returning();
    return deletedTransaction;
  }

  // Transaction Types (user defined + pre-defined i.e. income, expense, bill, etc.)

  async getTransactionTypes(): Array<TCommonTransactionTypeResponse> {
    const transactionTypes: Array<TTransactionTypeResult> = await this.db
      .select()
      .from(transactionTypes);
    return transactionTypes;
  }

  async getTransactionTypeById(
    transaction: number
  ): TCommonTransactionTypeResponse {
    const [transactionType]: Array<TTransactionTypeResult> = await this.db
      .select()
      .from(transactionTypes)
      .where(eq(transactionTypes.id, transaction));
    return transactionType;
  }

  async createTransactionType(
    transaction: TBudget
  ): TCommonTransactionTypeResponse {
    const [newTransactionType]: Array<TTransactionTypeResult> = await this.db
      .insert(transactionTypes)
      .values({
        name: transaction.name,
        description: transaction.description,
      })
      .returning();
    return newTransactionType;
  }

  async updateTransactionType(
    transaction: TBudget
  ): TCommonTransactionTypeResponse {
    const [updatedTransactionType]: Array<TTransactionTypeResult> =
      await this.db
        .update(transactionTypes)
        .set({
          name: transaction.name,
          description: transaction.description,
        })
        .where(eq(transactionTypes.id, transaction.id))
        .returning();
    return updatedTransactionType;
  }

  async deleteTransactionType(
    transactionId: number
  ): TCommonTransactionTypeResponse {
    const [deletedTransactionType]: Array<TTransactionTypeResult> =
      await this.db
        .delete()
        .from(transactionTypes)
        .where(eq(transactionTypes.id, transactionId))
        .returning();
    return deletedTransactionType;
  }
}

export { IBudgetRepository, BudgetRepository };
