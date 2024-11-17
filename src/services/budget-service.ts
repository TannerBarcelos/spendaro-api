import type { TBudgetCategoryItemToCreate, TBudgetCategoryItemToUpdate, TBudgetCategoryToCreate, TBudgetCategoryToUpdate, TBudgetToCreate, TBudgetToUpdate, TTransactionToCreate, TTransactionToUpdate, TTransactionTypeToCreate, TTransactionTypeToUpdate } from "@/handlers/budget/budget-schemas";
import type { IBudgetRepository } from "@/repositories/budget-repository";

import { NotFoundError } from "@/utils/error";

export class BudgetService {
  private budget_repo: IBudgetRepository;

  constructor(budget_repo: IBudgetRepository) {
    this.budget_repo = budget_repo;
  }

  async getBudgets(user_id: string) {
    const budgets = await this.budget_repo.getBudgets(user_id);
    return budgets;
  }

  async getBudgetById(user_id: string, budget_id: number) {
    const budget = await this.budget_repo.getBudgetById(user_id, budget_id);
    if (!budget) {
      throw new NotFoundError("Budget not found", [`budget with id ${budget_id} could not be found`]);
    }
    return budget;
  }

  async createBudget(budget: TBudgetToCreate) {
    return await this.budget_repo.createBudget(budget);
  }

  async updateBudget(user_id: string, budget_id: number, budget_to_update: TBudgetToUpdate) {
    const budget = await this.getBudgetById(user_id, budget_id);

    if (!budget) {
      throw new NotFoundError("Budget not found", [user_id, budget_id]);
    }

    const updatedBudget = await this.budget_repo.updateBudget(user_id, budget_id, budget_to_update);
    return updatedBudget;
  }

  async deleteBudget(user_id: string, budget_id: number) {
    const budget = await this.getBudgetById(user_id, budget_id);

    if (!budget) {
      throw new NotFoundError("Budget not found", [user_id, budget_id]);
    }
    const deletedBudget = await this.budget_repo.deleteBudget(user_id, budget_id);
    return deletedBudget;
  }

  async getBudgetCategories(user_id: string, budget_id: number) {
    const budget = await this.getBudgetById(user_id, budget_id);
    if (!budget) {
      throw new NotFoundError("Budget not found", [`budget with id ${budget_id} could not be found`]);
    }
    const categories = await this.budget_repo.getBudgetCategories(budget_id);
    return categories;
  }

  async getBudgetCategoryById(user_id: string, budget_id: number, category_id: number) {
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

  async createBudgetCategory(user_id: string, category: TBudgetCategoryToCreate) {
    const budget = await this.getBudgetById(user_id, category.budget_id);
    if (!budget) {
      throw new NotFoundError("Budget category not found", [`budget with id ${category.budget_id} could not be found`]);
    }
    const createdCategory = await this.budget_repo.createBudgetCategory(category);
    return createdCategory;
  }

  async updateBudgetCategory(user_id: string, budget_id: number, category_id: number, category: TBudgetCategoryToUpdate) {
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

  async deleteBudgetCategory(user_id: string, budget_id: number, category_id: number) {
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

  async getBudgetCategoryItems(user_id: string, budget_id: number, category_id: number) {
    const budget = await this.getBudgetById(user_id, budget_id);
    if (!budget) {
      throw new NotFoundError("Budget not found", [`budget with id ${budget_id} could not be found`]);
    }
    const category = await this.getBudgetCategoryById(user_id, budget_id, category_id);
    if (!category) {
      throw new NotFoundError("Budget category not found", [`category with id ${category_id} could not be found`]);
    }
    const items = await this.budget_repo.getBudgetCategoryItems(budget_id, category_id);
    return items;
  }

  async getBudgetCategoryItemById(user_id: string, budget_id: number, category_id: number, item_id: number) {
    const budget = await this.getBudgetById(user_id, budget_id);
    if (!budget) {
      throw new NotFoundError("Budget not found", [`budget with id ${budget_id} could not be found`]);
    }
    const category = await this.getBudgetCategoryById(user_id, budget_id, category_id);
    if (!category) {
      throw new NotFoundError("Budget category not found", [`category with id ${category_id} could not be found`]);
    }
    const item = await this.budget_repo.getBudgetCategoryItemById(category_id, item_id);
    if (!item) {
      throw new NotFoundError("Budget category item not found", [`item with id ${item_id} could not be found`]);
    }
    return item;
  }

  async createBudgetCategoryItem(user_id: string, budget_id: number, category_id: number, item: TBudgetCategoryItemToCreate) {
    const budget = await this.getBudgetById(user_id, budget_id);
    if (!budget) {
      throw new NotFoundError("Budget not found", [`budget with id ${budget_id} could not be found`]);
    }
    const category = await this.getBudgetCategoryById(user_id, budget_id, category_id);
    if (!category) {
      throw new NotFoundError("Budget category not found", [`category with id ${category_id} could not be found`]);
    }
    const createdItem = await this.budget_repo.createBudgetCategoryItem(item);
    return createdItem;
  }

  async updateBudgetCategoryItem(user_id: string, budget_id: number, category_id: number, item_id: number, item: TBudgetCategoryItemToUpdate) {
    const budget = await this.getBudgetById(user_id, budget_id);
    if (!budget) {
      throw new NotFoundError("Budget not found", [`budget with id ${budget_id} could not be found`]);
    }
    const category = await this.getBudgetCategoryById(user_id, budget_id, category_id);
    if (!category) {
      throw new NotFoundError("Budget category not found", [`category with id ${category_id} could not be found`]);
    }
    const itemExists = await this.budget_repo.getBudgetCategoryItemById(category_id, item_id);
    if (!itemExists) {
      throw new NotFoundError("Budget category item not found", [`item with id ${item_id} could not be found`]);
    }
    const updatedItem = await this.budget_repo.updateBudgetCategoryItem(item_id, item);
    return updatedItem;
  }

  async deleteBudgetCategoryItem(user_id: string, budget_id: number, category_id: number, item_id: number) {
    const budget = await this.getBudgetById(user_id, budget_id);
    if (!budget) {
      throw new NotFoundError("Budget not found", [`budget with id ${budget_id} could not be found`]);
    }
    const category = await this.getBudgetCategoryById(user_id, budget_id, category_id);
    if (!category) {
      throw new NotFoundError("Budget category not found", [`category with id ${category_id} could not be found`]);
    }
    const itemExists = await this.budget_repo.getBudgetCategoryItemById(category_id, item_id);
    if (!itemExists) {
      throw new NotFoundError("Budget category item not found", [`item with id ${item_id} could not be found`]);
    }
    const deletedItem = await this.budget_repo.deleteBudgetCategoryItem(item_id);
    return deletedItem;
  }

  async deleteAllBudgetCategoryItems(user_id: string, budget_id: number, category_id: number) {
    const budget = await this.getBudgetById(user_id, budget_id);
    if (!budget) {
      throw new NotFoundError("Budget not found", [`budget with id ${budget_id} could not be found`]);
    }
    const category = await this.getBudgetCategoryById(user_id, budget_id, category_id);
    if (!category) {
      throw new NotFoundError("Budget category not found", [`category with id ${category_id} could not be found`]);
    }
    const deletedItems = await this.budget_repo.deleteAllBudgetCategoryItems(category_id);
    return deletedItems;
  }

  async getTransactions(user_id: string, budget_id: number) {
    const budget = await this.getBudgetById(user_id, budget_id);
    if (!budget) {
      throw new NotFoundError("Budget not found", [`budget with id ${budget_id} could not be found`]);
    }
    const transactions = this.budget_repo.getTransactions(budget_id);
    return transactions;
  }

  async getTransactionById(user_id: string, budget_id: number, transaction_id: number) {
    const budget = await this.getBudgetById(user_id, budget_id);
    if (!budget) {
      throw new NotFoundError("Budget not found", [`budget with id ${budget_id} could not be found`]);
    }
    const transaction = await this.budget_repo.getTransactionById(budget_id, transaction_id);
    if (!transaction) {
      throw new NotFoundError("Transaction not found", [`transaction with id ${transaction_id} could not be found`]);
    }
    return transaction;
  }

  async createTransaction(user_id: string, transaction: TTransactionToCreate) {
    const budget = await this.getBudgetById(user_id, transaction.budget_id);
    if (!budget) {
      throw new NotFoundError("Budget not found", [`budget with id ${transaction.budget_id} could not be found`]);
    }
    const createdTransaction = await this.budget_repo.createTransaction(transaction);
    return createdTransaction;
  }

  async updateTransaction(user_id: string, budget_id: number, transaction_id: number, transaction: TTransactionToUpdate) {
    const budget = await this.getBudgetById(user_id, budget_id);
    if (!budget) {
      throw new NotFoundError("Budget not found", [`budget with id ${budget_id} could not be found`]);
    }
    const transactionExists = await this.budget_repo.getTransactionById(budget_id, transaction_id);
    if (!transactionExists) {
      throw new NotFoundError("Transaction not found", [`transaction with id ${transaction_id} could not be found`]);
    }
    const updatedTransaction = await this.budget_repo.updateTransaction(budget_id, transaction_id, transaction);
    return updatedTransaction;
  }

  async deleteTransaction(user_id: string, budget_id: number, transaction_id: number) {
    const budget = await this.getBudgetById(user_id, budget_id);
    if (!budget) {
      throw new NotFoundError("Budget not found", [`budget with id ${budget_id} could not be found`]);
    }
    const transactionExists = await this.budget_repo.getTransactionById(budget_id, transaction_id);
    if (!transactionExists) {
      throw new NotFoundError("Transaction not found", [`transaction with id ${transaction_id} could not be found`]);
    }
    const deletedTransaction = await this.budget_repo.deleteTransaction(budget_id, transaction_id);
    return deletedTransaction;
  }

  async getTransactionTypes(user_id: string, budget_id: number) {
    const budget = await this.getBudgetById(user_id, budget_id);
    if (!budget) {
      throw new NotFoundError("Budget not found", [`budget with id ${budget_id} could not be found`]);
    }
    const transaction_types = await this.budget_repo.getTransactionTypes(budget_id);
    return transaction_types;
  }

  async getTransactionTypeById(user_id: string, budget_id: number, transaction_type_id: number) {
    const budget = await this.getBudgetById(user_id, budget_id);
    if (!budget) {
      throw new NotFoundError("Budget not found", [`budget with id ${budget_id} could not be found`]);
    }
    const transaction_type = await this.budget_repo.getTransactionTypeById(budget_id, transaction_type_id);
    if (!transaction_type) {
      throw new NotFoundError("Transaction type not found", [`transaction type with id ${transaction_type_id} could not be found`]);
    }
    return transaction_type;
  }

  async createTransactionType(user_id: string, transaction_type: TTransactionTypeToCreate) {
    const budget = await this.getBudgetById(user_id, transaction_type.budget_id);
    if (!budget) {
      throw new NotFoundError("Budget not found", [`budget with id ${transaction_type.budget_id} could not be found`]);
    }
    const createdTransactionType = await this.budget_repo.createTransactionType(transaction_type);
    return createdTransactionType;
  }

  async updateTransactionType(user_id: string, budget_id: number, transaction_type_id: number, transaction_type: TTransactionTypeToUpdate) {
    const budget = await this.getBudgetById(user_id, budget_id);
    if (!budget) {
      throw new NotFoundError("Budget not found", [`budget with id ${budget_id} could not be found`]);
    }
    const transactionTypeExists = await this.budget_repo.getTransactionTypeById(budget_id, transaction_type_id);
    if (!transactionTypeExists) {
      throw new NotFoundError("Transaction type not found", [`transaction type with id ${transaction_type_id} could not be found`]);
    }
    const updatedTransactionType = await this.budget_repo.updateTransactionType(budget_id, transaction_type_id, transaction_type);
    return updatedTransactionType;
  }

  async deleteTransactionType(user_id: string, budget_id: number, transaction_id: number) {
    const budget = await this.getBudgetById(user_id, budget_id);
    if (!budget) {
      throw new NotFoundError("Budget not found", [`budget with id ${budget_id} could not be found`]);
    }
    const transactionTypeExists = await this.budget_repo.getTransactionTypeById(budget_id, transaction_id);
    if (!transactionTypeExists) {
      throw new NotFoundError("Transaction type not found", [`transaction type with id ${transaction_id} could not be found`]);
    }
    const deletedTransactionType = await this.budget_repo.deleteTransactionType(budget_id, transaction_id);
    return deletedTransactionType;
  }
}
