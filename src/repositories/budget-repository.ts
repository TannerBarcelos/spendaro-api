import {
  TBudget,
  TBudgetCategoryItemResult,
  TBudgetCategoryResult,
  TBudgetResult,
  TTransactionResult,
  TTransactionTypeResult,
} from '@/db/schema';

type TCommonBudgetResponse = Promise<TBudgetResult>;
type TCommonBudgetCategoryResponse = Promise<TBudgetCategoryResult>;
type TCommonBudgetCategoryItemResponse = Promise<TBudgetCategoryItemResult>;
type TCommonTransactionResponse = Promise<TTransactionResult>;
type TCommonTransactionTypeResponse = Promise<TTransactionTypeResult>;

export interface IBudgetRepository {
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
  getTransactions(
    itemId: number
  ): Array<TCommonTransactionResponse>;
  getTransactionById(
    transactionId: number
  ): TCommonTransactionResponse;
  createTransaction(
    transaction: TBudget
  ): TCommonTransactionResponse;
  updateTransaction(
    transaction: TBudget
  ): TCommonTransactionResponse;
  deleteTransaction(
    transactionId: number
  ): TCommonTransactionResponse;

  // Transaction Types (user defined + pre-defined i.e. income, expense, bill, etc.)
  getTransactionTypes(): Array<TCommonTransactionTypeResponse>;
  getTransactionTypeById(
    transaction: number
  ): TCommonTransactionTypeResponse;
  createTransactionType(
    transaction: TBudget
  ): TCommonTransactionTypeResponse;
  updateTransactionType(
    transaction: TBudget
  ): TCommonTransactionTypeResponse;
  deleteTransactionType(
    transactionId: number
  ): TCommonTransactionTypeResponse;
}
