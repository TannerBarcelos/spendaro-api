import type {
  TBudgetCategory,
  TBudgetCategoryItem,
  TInsertBudget,
  TTransaction,
  TTransactionType,
  TUpdateBudget,
  TUpdateBudgetCategory,
  TUpdateBudgetCategoryItem,
  TUpdateTransaction,
  TUpdateTransactionType,
} from "@/db/types";
import type { IBudgetRepository } from "@/repositories/budget-repository";

export class BudgetService {
  private budget_repo: IBudgetRepository;

  constructor(budget_repo: IBudgetRepository) {
    this.budget_repo = budget_repo;
  }

  getBudgets(user_id: number) {
    return this.budget_repo.getBudgets(user_id);
  }

  getBudgetById(user_id: number, budget_id: number) {
    return this.budget_repo.getBudgetById(user_id, budget_id);
  }

  createBudget(budget: TInsertBudget) {
    return this.budget_repo.createBudget(budget);
  }

  updateBudget(user_id: number, budget_id: number, budget_to_update: TUpdateBudget) {
    return this.budget_repo.updateBudget(user_id, budget_id, budget_to_update);
  }

  deleteBudget(user_id: number, budget_id: number) {
    return this.budget_repo.deleteBudget(user_id, budget_id);
  }

  getBudgetCategories(budget_id: number) {
    return this.budget_repo.getBudgetCategories(budget_id);
  }

  getBudgetCategoryById(budget_id: number, category_id: number) {
    return this.budget_repo.getBudgetCategoryById(budget_id, category_id);
  }

  createBudgetCategory(category: TBudgetCategory) {
    return this.budget_repo.createBudgetCategory(category);
  }

  updateBudgetCategory(budget_id: number, category_id: number, category: TUpdateBudgetCategory) {
    return this.budget_repo.updateBudgetCategory(budget_id, category_id, category);
  }

  deleteBudgetCategory(budget_id: number, category_id: number) {
    return this.budget_repo.deleteBudgetCategory(budget_id, category_id);
  }

  getBudgetCategoryItems(budget_id: number, category_id: number) {
    return this.budget_repo.getBudgetCategoryItems(budget_id, category_id);
  }

  getBudgetCategoryItemById(category_id: number, item_id: number) {
    return this.budget_repo.getBudgetCategoryItemById(category_id, item_id);
  }

  createBudgetCategoryItem(item: TBudgetCategoryItem) {
    return this.budget_repo.createBudgetCategoryItem(item);
  }

  updateBudgetCategoryItem(item_id: number, item: TUpdateBudgetCategoryItem) {
    return this.budget_repo.updateBudgetCategoryItem(item_id, item);
  }

  deleteBudgetCategoryItem(item_id: number) {
    return this.budget_repo.deleteBudgetCategoryItem(item_id);
  }

  deleteAllBudgetCategoryItems(category_id: number) {
    return this.budget_repo.deleteAllBudgetCategoryItems(category_id);
  }

  getTransactions(budget_id: number) {
    return this.budget_repo.getTransactions(budget_id);
  }

  getTransactionById(budget_id: number, transaction_id: number) {
    return this.budget_repo.getTransactionById(budget_id, transaction_id);
  }

  createTransaction(transaction: TTransaction) {
    return this.budget_repo.createTransaction(transaction);
  }

  updateTransaction(budget_id: number, transaction_id: number, transaction: TUpdateTransaction) {
    return this.budget_repo.updateTransaction(budget_id, transaction_id, transaction);
  }

  deleteTransaction(budget_id: number, transaction_id: number) {
    return this.budget_repo.deleteTransaction(budget_id, transaction_id);
  }

  getTransactionTypes(budget_id: number) {
    return this.budget_repo.getTransactionTypes(budget_id);
  }

  getTransactionTypeById(budget_id: number, transaction_type_id: number) {
    return this.budget_repo.getTransactionTypeById(budget_id, transaction_type_id);
  }

  createTransactionType(transaction_type: TTransactionType) {
    return this.budget_repo.createTransactionType(transaction_type);
  }

  updateTransactionType(budget_id: number, transaction_type_id: number, transaction_type: TUpdateTransactionType) {
    return this.budget_repo.updateTransactionType(budget_id, transaction_type_id, transaction_type);
  }

  deleteTransactionType(budget_id: number, transaction_id: number) {
    return this.budget_repo.deleteTransactionType(budget_id, transaction_id);
  }
}
