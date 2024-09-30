import { TBudget } from '@/db/schema';
import { IBudgetRepository } from '@/repositories/budget-repository';

export default class BudgetService {
  private budgetRepo: IBudgetRepository;

  constructor(budgetRepo: IBudgetRepository) {
    this.budgetRepo = budgetRepo;
  }

  getBudgets(userId: number) {
    return this.budgetRepo.getBudgets(userId);
  }

  getBudgetById(budgetId: number) {
    return this.budgetRepo.getBudgetById(budgetId);
  }

  createBudget(budget: TBudget) {
    return this.budgetRepo.createBudget(budget);
  }

  updateBudget(budget: TBudget) {
    return this.budgetRepo.updateBudget(budget);
  }

  deleteBudget(budgetId: number) {
    return this.budgetRepo.deleteBudget(budgetId);
  }

  getBudgetCategories(budgetId: number) {
    return this.budgetRepo.getBudgetCategories(budgetId);
  }

  getBudgetCategoryById(categoryId: number) {
    return this.budgetRepo.getBudgetCategoryById(categoryId);
  }

  createBudgetCategory(category: TBudget) {
    return this.budgetRepo.createBudgetCategory(category);
  }

  updateBudgetCategory(category: TBudget) {
    return this.budgetRepo.updateBudgetCategory(category);
  }

  deleteBudgetCategory(categoryId: number) {
    return this.budgetRepo.deleteBudgetCategory(categoryId);
  }

  getBudgetCategoryItems(categoryId: number) {
    return this.budgetRepo.getBudgetCategoryItems(categoryId);
  }

  getBudgetCategoryItemById(itemId: number) {
    return this.budgetRepo.getBudgetCategoryItemById(itemId);
  }

  createBudgetCategoryItem(item: TBudget) {
    return this.budgetRepo.createBudgetCategoryItem(item);
  }

  updateBudgetCategoryItem(item: TBudget) {
    return this.budgetRepo.updateBudgetCategoryItem(item);
  }

  deleteBudgetCategoryItem(itemId: number) {
    return this.budgetRepo.deleteBudgetCategoryItem(itemId);
  }

  deleteAllBudgetCategoryItems(categoryId: number) {
    return this.budgetRepo.deleteAllBudgetCategoryItems(categoryId);
  }

  getTransactions(itemId: number) {
    return this.budgetRepo.getTransactions(itemId);
  }

  getTransactionById(transactionId: number) {
    return this.budgetRepo.getTransactionById(transactionId);
  }

  createTransaction(transaction: TBudget) {
    return this.budgetRepo.createTransaction(transaction);
  }

  updateTransaction(transaction: TBudget) {
    return this.budgetRepo.updateTransaction(transaction);
  }

  deleteTransaction(transactionId: number) {
    return this.budgetRepo.deleteTransaction(transactionId);
  }

  getTransactionTypes() {
    return this.budgetRepo.getTransactionTypes();
  }

  getTransactionTypeById(transaction: number) {
    return this.budgetRepo.getTransactionTypeById(transaction);
  }

  createTransactionType(transaction: TBudget) {
    return this.budgetRepo.createTransactionType(transaction);
  }

  updateTransactionType(transaction: TBudget) {
    return this.budgetRepo.updateTransactionType(transaction);
  }

  deleteTransactionType(transactionId: number) {
    return this.budgetRepo.deleteTransactionType(transactionId);
  }
}
