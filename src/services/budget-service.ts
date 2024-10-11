import type {
  TBudgetCategory,
  TBudgetCategoryItem,
  TInsertBudget,
  TTransaction,
  TTransactionType,
  TUpdateBudget,
  TUpdateBudgetCategory,
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

  getBudgetCategories(user_id: number, budget_id: number) {
    return this.budget_repo.getBudgetCategories(budget_id);
  }

  getBudgetCategoryById(user_id: number, budget_id: number, category_id: number) {
    return this.budget_repo.getBudgetCategoryById(budget_id, category_id);
  }

  createBudgetCategory(user_id: number, category: TBudgetCategory) {
    return this.budget_repo.createBudgetCategory(category);
  }

  updateBudgetCategory(user_id: number, budget_id: number, category_id: number, category: TUpdateBudgetCategory) {
    return this.budget_repo.updateBudgetCategory(budget_id, category_id, category);
  }

  deleteBudgetCategory(user_id: number, category_id: number) {
    return this.budget_repo.deleteBudgetCategory(category_id);
  }

  getBudgetCategoryItems(user_id: number, budget_id: number, category_id: number) {
    return this.budget_repo.getBudgetCategoryItems(user_id, budget_id, category_id);
  }

  getBudgetCategoryItemById(user_id: number, budget_id: number, category_id: number, item_id: number) {
    return this.budget_repo.getBudgetCategoryItemById(user_id, budget_id, category_id, item_id);
  }

  createBudgetCategoryItem(user_id: number, item: TBudgetCategoryItem) {
    return this.budget_repo.createBudgetCategoryItem(item);
  }

  updateBudgetCategoryItem(user_id: number, item_id: number, item: TBudgetCategoryItem) {
    return this.budget_repo.updateBudgetCategoryItem(item_id, item);
  }

  deleteBudgetCategoryItem(user_id: number, item_id: number) {
    return this.budget_repo.deleteBudgetCategoryItem(user_id, item_id);
  }

  deleteAllBudgetCategoryItems(user_id: number, category_id: number) {
    return this.budget_repo.deleteAllBudgetCategoryItems(user_id, category_id);
  }

  getTransactions(user_id: number, budget_id: number) {
    return this.budget_repo.getTransactions(budget_id);
  }

  getTransactionById(user_id: number, budget_id: number, transaction_id: number) {
    return this.budget_repo.getTransactionById(budget_id, transaction_id);
  }

  createTransaction(user_id: number, transaction: TTransaction) {
    return this.budget_repo.createTransaction(transaction);
  }

  updateTransaction(user_id: number, budget_id: number, transaction_id: number, transaction: TTransaction) {
    return this.budget_repo.updateTransaction(budget_id, transaction_id, transaction);
  }

  deleteTransaction(user_id: number, budget_id: number, transaction_id: number) {
    return this.budget_repo.deleteTransaction(budget_id, transaction_id);
  }

  getTransactionTypes(user_id: number) {
    return this.budget_repo.getTransactionTypes(user_id);
  }

  getTransactionTypeById(user_id: number, transaction: number) {
    return this.budget_repo.getTransactionTypeById(user_id, transaction);
  }

  createTransactionType(user_id: number, transaction: TTransactionType) {
    return this.budget_repo.createTransactionType(user_id, transaction);
  }

  updateTransactionType(user_id: number, type_id: number, transaction: TUpdateTransactionType) {
    return this.budget_repo.updateTransactionType(user_id, type_id, transaction);
  }

  deleteTransactionType(user_id: number, transaction_id: number) {
    return this.budget_repo.deleteTransactionType(user_id, transaction_id);
  }
}
