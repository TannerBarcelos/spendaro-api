import type {
  TBudgetCategory,
  TBudgetCategoryItem,
  TInsertBudget,
  TTransaction,
  TTransactionType,
  TUpdateBudget,
  TUpdateBudgetCategory,
} from "@/db/types.js";
import type { IBudgetRepository } from "@/repositories/budget-repository.js";

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

  deleteBudgetCategory(category_id: number) {
    return this.budget_repo.deleteBudgetCategory(category_id);
  }

  getBudgetCategoryItems(user_id: number, budget_id: number, category_id: number) {
    return this.budget_repo.getBudgetCategoryItems(user_id, budget_id, category_id);
  }

  getBudgetCategoryItemById(user_id: number, budget_id: number, category_id: number, item_id: number) {
    return this.budget_repo.getBudgetCategoryItemById(user_id, budget_id, category_id, item_id);
  }

  createBudgetCategoryItem(item: TBudgetCategoryItem) {
    return this.budget_repo.createBudgetCategoryItem(item);
  }

  updateBudgetCategoryItem(item: TBudgetCategoryItem) {
    return this.budget_repo.updateBudgetCategoryItem(item);
  }

  deleteBudgetCategoryItem(user_id: number, item_id: number) {
    return this.budget_repo.deleteBudgetCategoryItem(user_id, item_id);
  }

  deleteAllBudgetCategoryItems(user_id: number, category_id: number) {
    return this.budget_repo.deleteAllBudgetCategoryItems(user_id, category_id);
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

  updateTransaction(budget_id: number, transaction_id: number, transaction: TTransaction) {
    return this.budget_repo.updateTransaction(budget_id, transaction_id, transaction);
  }

  deleteTransaction(budget_id: number, transaction_id: number) {
    return this.budget_repo.deleteTransaction(budget_id, transaction_id);
  }

  getTransactionTypes() {
    return this.budget_repo.getTransactionTypes();
  }

  getTransactionTypeById(transaction: number) {
    return this.budget_repo.getTransactionTypeById(transaction);
  }

  createTransactionType(transaction: TTransactionType) {
    return this.budget_repo.createTransactionType(transaction);
  }

  updateTransactionType(transaction: TTransactionType) {
    return this.budget_repo.updateTransactionType(transaction);
  }

  deleteTransactionType(transaction_id: number) {
    return this.budget_repo.deleteTransactionType(transaction_id);
  }
}
