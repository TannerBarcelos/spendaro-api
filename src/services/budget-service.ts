import type { TBudgetCategoryItemToCreate, TBudgetCategoryItemToUpdate, TBudgetCategoryToCreate, TBudgetCategoryToUpdate, TBudgetToCreate, TBudgetToUpdate, TTransactionToCreate, TTransactionToUpdate, TTransactionTypeToCreate, TTransactionTypeToUpdate } from "@/handlers/budget/budget-schemas";
import type { IBudgetRepository } from "@/repositories/budget-repository";

import { NotFoundError } from "@/utils/error";

export class BudgetService {
  private budget_repo: IBudgetRepository;

  constructor(budget_repo: IBudgetRepository) {
    this.budget_repo = budget_repo;
  }

  async getBudgets(user_id: number) {
    const budgets = await this.budget_repo.getBudgets(user_id);
    return budgets;
  }

  async getBudgetById(user_id: number, budget_id: number) {
    const budget = await this.budget_repo.getBudgetById(user_id, budget_id);
    if (!budget) {
      throw new NotFoundError("Budget not found", [`budget with id ${budget_id} could not be found`]);
    }
    return budget;
  }

  async createBudget(budget: TBudgetToCreate) {
    return await this.budget_repo.createBudget(budget);
  }

  async updateBudget(user_id: number, budget_id: number, budget_to_update: TBudgetToUpdate) {
    const budget = await this.getBudgetById(user_id, budget_id);

    if (!budget) {
      throw new NotFoundError("Budget not found", [user_id, budget_id]);
    }

    const updatedBudget = await this.budget_repo.updateBudget(user_id, budget_id, budget_to_update);
    return updatedBudget;
  }

  async deleteBudget(user_id: number, budget_id: number) {
    const budget = await this.getBudgetById(user_id, budget_id);

    if (!budget) {
      throw new NotFoundError("Budget not found", [user_id, budget_id]);
    }
    const deletedBudget = await this.budget_repo.deleteBudget(user_id, budget_id);
    return deletedBudget;
  }

  async getBudgetCategories(user_id: number, budget_id: number) {
    const budget = await this.getBudgetById(user_id, budget_id);
    if (!budget) {
      throw new NotFoundError("Budget not found", [`budget with id ${budget_id} could not be found`]);
    }
    const categories = await this.budget_repo.getBudgetCategories(budget_id);
    return categories;
  }

  async getBudgetCategoryById(user_id: number, budget_id: number, category_id: number) {
    const budget = await this.getBudgetById(user_id, budget_id);

    if (!budget) {
      throw new NotFoundError("Budget not found", [user_id, budget_id]);
    }

    const budgetCategory = await this.budget_repo.getBudgetCategoryById(budget_id, category_id);

    if (!budgetCategory) {
      throw new NotFoundError("Budget category not found", [`category with id ${category_id} could not be found`]);
    }

    return budgetCategory;
  }

  async createBudgetCategory(user_id: number, category: TBudgetCategoryToCreate) {
    const budget = await this.getBudgetById(user_id, category.budget_id);
    if (!budget) {
      throw new NotFoundError("Budget category not found", [`budget with id ${category.budget_id} could not be found`]);
    }
    const createdCategory = await this.budget_repo.createBudgetCategory(category);
    return createdCategory;
  }

  async updateBudgetCategory(user_id: number, budget_id: number, category_id: number, category: TBudgetCategoryToUpdate) {
    const budget = await this.getBudgetById(user_id, budget_id);
    if (!budget) {
      throw new NotFoundError("Budget not found", [`budget with id ${budget_id} could not be found`]);
    }
    const categoryExists = await this.budget_repo.getBudgetCategoryById(budget_id, category_id);
    if (!categoryExists) {
      throw new NotFoundError("Budget category not found", [`category with id ${category_id} could not be found`]);
    }
    const updatedCategory = await this.budget_repo.updateBudgetCategory(budget_id, category_id, category);
    return updatedCategory;
  }

  async deleteBudgetCategory(user_id: number, budget_id: number, category_id: number) {
    const budget = await this.getBudgetById(user_id, budget_id);
    if (!budget) {
      throw new NotFoundError("Budget not found", [`budget with id ${budget_id} could not be found`]);
    }
    const categoryExists = await this.budget_repo.getBudgetCategoryById(budget_id, category_id);
    if (!categoryExists) {
      throw new NotFoundError("Budget category not found", [`category with id ${category_id} could not be found`]);
    }
    const deletedCategory = await this.budget_repo.deleteBudgetCategory(budget_id, category_id);
    return deletedCategory;
  }

  getBudgetCategoryItems(budget_id: number, category_id: number) {
    return this.budget_repo.getBudgetCategoryItems(budget_id, category_id);
  }

  getBudgetCategoryItemById(category_id: number, item_id: number) {
    return this.budget_repo.getBudgetCategoryItemById(category_id, item_id);
  }

  createBudgetCategoryItem(item: TBudgetCategoryItemToCreate) {
    return this.budget_repo.createBudgetCategoryItem(item);
  }

  updateBudgetCategoryItem(item_id: number, item: TBudgetCategoryItemToUpdate) {
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

  createTransaction(transaction: TTransactionToCreate) {
    return this.budget_repo.createTransaction(transaction);
  }

  updateTransaction(budget_id: number, transaction_id: number, transaction: TTransactionToUpdate) {
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

  createTransactionType(transaction_type: TTransactionTypeToCreate) {
    return this.budget_repo.createTransactionType(transaction_type);
  }

  updateTransactionType(budget_id: number, transaction_type_id: number, transaction_type: TTransactionTypeToUpdate) {
    return this.budget_repo.updateTransactionType(budget_id, transaction_type_id, transaction_type);
  }

  deleteTransactionType(budget_id: number, transaction_id: number) {
    return this.budget_repo.deleteTransactionType(budget_id, transaction_id);
  }
}
