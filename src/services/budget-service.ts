import { TBudget, TBudgetCategory, TBudgetCategoryItem, TTransaction, TTransactionType } from '@/db/schema';
import { IBudgetRepository } from '@/repositories/budget-repository';

class BudgetService {
  private budget_repo: IBudgetRepository;

  constructor(budget_repo: IBudgetRepository) {
    this.budget_repo = budget_repo;
  }

  getBudgets(user_id: number) {
    return this.budget_repo.getBudgets(user_id);
  }

  getBudgetById(budget_id: number) {
    return this.budget_repo.getBudgetById(budget_id);
  }

  createBudget(budget: TBudget) {
    return this.budget_repo.createBudget(budget);
  }

  updateBudget(budget_id: number, budget: TBudget) {
    return this.budget_repo.updateBudget(budget_id, budget);
  }

  deleteBudget(budget_id: number) {
    return this.budget_repo.deleteBudget(budget_id);
  }

  getBudgetCategories(budget_id: number) {
    return this.budget_repo.getBudgetCategories(budget_id);
  }

  getBudgetCategoryById(category_id: number) {
    return this.budget_repo.getBudgetCategoryById(category_id);
  }

  createBudgetCategory(category: TBudgetCategory) {
    return this.budget_repo.createBudgetCategory(category);
  }

  updateBudgetCategory(category: TBudgetCategory) {
    return this.budget_repo.updateBudgetCategory(category);
  }

  deleteBudgetCategory(category_id: number) {
    return this.budget_repo.deleteBudgetCategory(category_id);
  }

  getBudgetCategoryItems(category_id: number) {
    return this.budget_repo.getBudgetCategoryItems(category_id);
  }

  getBudgetCategoryItemById(item_id: number) {
    return this.budget_repo.getBudgetCategoryItemById(item_id);
  }

  createBudgetCategoryItem(item: TBudgetCategoryItem) {
    return this.budget_repo.createBudgetCategoryItem(item);
  }

  updateBudgetCategoryItem(item: TBudgetCategoryItem) {
    return this.budget_repo.updateBudgetCategoryItem(item);
  }

  deleteBudgetCategoryItem(item_id: number) {
    return this.budget_repo.deleteBudgetCategoryItem(item_id);
  }

  deleteAllBudgetCategoryItems(category_id: number) {
    return this.budget_repo.deleteAllBudgetCategoryItems(category_id);
  }

  getTransactions(item_id: number) {
    return this.budget_repo.getTransactions(item_id);
  }

  getTransactionById(transaction_id: number) {
    return this.budget_repo.getTransactionById(transaction_id);
  }

  createTransaction(transaction: TTransaction) {
    return this.budget_repo.createTransaction(transaction);
  }

  updateTransaction(transaction: TTransaction) {
    return this.budget_repo.updateTransaction(transaction);
  }

  deleteTransaction(transaction_id: number) {
    return this.budget_repo.deleteTransaction(transaction_id);
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

export { BudgetService };