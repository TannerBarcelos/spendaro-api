import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";

import { and, eq } from "drizzle-orm";

import type * as budget_types from "@/handlers/budget/budget-schemas";

import * as schema from "@/db/schema";

interface IBudgetRepository {
  getBudgets: (user_id: string) => Promise<Array<budget_types.TBudgetResult>>;
  getBudgetById: (user_id: string, budget_id: number) => Promise<budget_types.TBudgetResult>;
  createBudget: (budget: budget_types.TBudgetToCreate) => Promise<budget_types.TBudgetResult>;
  updateBudget: (user_id: string, budget_id: number, budget_to_update: budget_types.TBudgetToUpdate) => Promise<budget_types.TBudgetResult>;
  deleteBudget: (user_id: string, budget_id: number) => Promise<budget_types.TBudgetResult>;
  getBudgetCategories: (budget_id: number) => Promise<Array<budget_types.TBudgetCategoryResult>>;
  getBudgetCategoryById: (budget_category_id: number, category_id: number) => Promise<budget_types.TBudgetCategoryResult>;
  createBudgetCategory: (category: budget_types.TBudgetCategoryToCreate) => Promise<budget_types.TBudgetCategoryResult>;
  updateBudgetCategory: (budget_id: number, category_id: number, category: budget_types.TBudgetCategoryToUpdate) => Promise<budget_types.TBudgetCategoryResult>;
  deleteBudgetCategory: (budget_id: number, categoryId: number) => Promise<budget_types.TBudgetCategoryResult>;
  getBudgetCategoryItems: (budget_id: number, category_id: number) => Promise<Array<budget_types.TBudgetCategoryItemResult>>;
  getBudgetCategoryItemById: (category_id: number, item_id: number) => Promise<budget_types.TBudgetCategoryItemResult>;
  createBudgetCategoryItem: (item: budget_types.TBudgetCategoryItemToCreate) => Promise<budget_types.TBudgetCategoryItemResult>;
  updateBudgetCategoryItem: (item_id: number, item: budget_types.TBudgetCategoryItemToUpdate) => Promise<budget_types.TBudgetCategoryItemResult>;
  deleteBudgetCategoryItem: (item_id: number) => Promise<budget_types.TBudgetCategoryItemResult>;
  deleteAllBudgetCategoryItems: (category_id: number) => Promise<budget_types.TBudgetCategoryItemResult[]>;
  getTransactions: (budget_id: number) => Promise<Array<budget_types.TTransactionResult>>;
  getTransactionById: (budget_id: number, transaction_id: number) => Promise<budget_types.TTransactionResult>;
  createTransaction: (transaction: budget_types.TTransactionToCreate) => Promise<budget_types.TTransactionResult>;
  updateTransaction: (budget_id: number, transaction_id: number, transaction: budget_types.TTransactionToUpdate) => Promise<budget_types.TTransactionResult>;
  deleteTransaction: (budget_id: number, transaction_id: number) => Promise<budget_types.TTransactionResult>;
  getTransactionTypes: (budget_id: number) => Promise<Array<budget_types.TTransactionTypeResult>>;
  getTransactionTypeById: (budget_id: number, transaction_type_id: number) => Promise<budget_types.TTransactionTypeResult>;
  createTransactionType: (transaction_type: budget_types.TTransactionTypeToCreate) => Promise<budget_types.TTransactionTypeResult>;
  updateTransactionType: (budget_id: number, type_id: number, transaction_type: budget_types.TTransactionTypeToUpdate) => Promise<budget_types.TTransactionTypeResult>;
  deleteTransactionType: (budget_id: number, transaction_type_id: number) => Promise<budget_types.TTransactionTypeResult>;
}

export class BudgetRepository implements IBudgetRepository {
  constructor(private db: PostgresJsDatabase<typeof schema>) {
    this.db = db;
  }

  async getBudgets(user_id: string) {
    return await this.db
      .select()
      .from(schema.budgets)
      .where(eq(schema.budgets.user_id, user_id));
  }

  async getBudgetById(
    user_id: string,
    budget_id: number,
  ) {
    const [budget]: Array<budget_types.TBudgetResult> = await this.db
      .select()
      .from(schema.budgets)
      .where(
        and(
          eq(schema.budgets.id, budget_id),
          eq(schema.budgets.user_id, user_id),
        ),
      );
    return budget;
  }

  async createBudget(budget: budget_types.TBudgetToCreate) {
    const [newBudget]: Array<budget_types.TBudgetResult> = await this.db
      .insert(schema.budgets)
      .values(budget)
      .returning();
    return newBudget;
  }

  async updateBudget(user_id: string, budget_id: number, budget_to_update: budget_types.TBudgetToUpdate) {
    const [updatedBudget]: Array<budget_types.TBudgetResult> = await this.db
      .update(schema.budgets)
      .set(budget_to_update)
      .where(
        and(
          eq(schema.budgets.id, budget_id),
          eq(schema.budgets.user_id, user_id),
        ),
      )
      .returning();
    return updatedBudget;
  }

  async deleteBudget(
    user_id: string,
    budget_id: number,
  ) {
    const [deletedBudget]: Array<budget_types.TBudgetResult> = await this.db
      .delete(schema.budgets)
      .where(
        and(
          eq(schema.budgets.id, budget_id),
          eq(schema.budgets.user_id, user_id),
        ),
      )
      .returning();
    return deletedBudget;
  }

  async getBudgetCategories(
    budget_id: number,
  ) {
    return await this.db
      .select()
      .from(schema.budget_categories)
      .where(
        eq(schema.budget_categories.budget_id, budget_id),
        // no need to use user_id because budget categories are unique to a budget and cannot exist without a budget (witheld by the constraints)
      );
  }

  async getBudgetCategoryById(
    budget_id: number,
    category_id: number,
  ) {
    const [category]: Array<budget_types.TBudgetCategoryResult> = await this.db
      .select()
      .from(schema.budget_categories)
      .where(and(
        eq(schema.budget_categories.id, category_id),
        eq(schema.budget_categories.budget_id, budget_id),
      ));
    return category;
  }

  async createBudgetCategory(
    category: budget_types.TBudgetCategoryToCreate,
  ) {
    const [newCategory]: Array<budget_types.TBudgetCategoryResult> = await this.db
      .insert(schema.budget_categories)
      .values(category)
      .returning();
    return newCategory;
  }

  async updateBudgetCategory(
    budget_id: number,
    category_id: number,
    category_to_update: budget_types.TBudgetCategoryToUpdate,
  ) {
    const [updatedCategory]: Array<budget_types.TBudgetCategoryResult> = await this.db
      .update(schema.budget_categories)
      .set(category_to_update)
      .where(
        and(
          eq(schema.budget_categories.id, category_id),
          eq(schema.budget_categories.budget_id, budget_id),
        ),
      )
      .returning();
    return updatedCategory;
  }

  async deleteBudgetCategory(
    budget_id: number,
    category_id: number,
  ) {
    const [deletedCategory]: Array<budget_types.TBudgetCategoryResult> = await this.db
      .delete(schema.budget_categories)
      .where(and(
        eq(schema.budget_categories.id, category_id),
        eq(schema.budget_categories.budget_id, budget_id),
      ))
      .returning();
    return deletedCategory;
  }

  async getBudgetCategoryItems(
    budget_id: number,
    category_id: number,
  ) {
    return await this.db
      .select()
      .from(schema.budget_category_items)
      .where(
        and(
          eq(schema.budget_category_items.category_id, category_id),
          eq(schema.budget_category_items.budget_id, budget_id),
        ),
      );
  }

  async getBudgetCategoryItemById(
    category_id: number,
    item_id: number,
  ) {
    const [item]: Array<budget_types.TBudgetCategoryItemResult> = await this.db
      .select()
      .from(schema.budget_category_items)
      .where(
        and(
          eq(schema.budget_category_items.id, item_id),
          eq(schema.budget_category_items.category_id, category_id),
        ),
      );
    return item;
  }

  async createBudgetCategoryItem(
    item: budget_types.TBudgetCategoryItemToCreate,
  ) {
    const [newItem]: Array<budget_types.TBudgetCategoryItemResult> = await this.db
      .insert(schema.budget_category_items)
      .values(item)
      .returning();
    return newItem;
  }

  async updateBudgetCategoryItem(
    item_id: number,
    item: budget_types.TBudgetCategoryItemToUpdate,
  ) {
    const [updatedItem]: Array<budget_types.TBudgetCategoryItemResult> = await this.db
      .update(schema.budget_category_items)
      .set(item)
      .where(eq(schema.budget_category_items.id, item_id))
      .returning();
    return updatedItem;
  }

  async deleteBudgetCategoryItem(
    itemId: number,
  ) {
    const [deletedItem]: Array<budget_types.TBudgetCategoryItemResult> = await this.db
      .delete(schema.budget_category_items)
      .where(eq(schema.budget_category_items.id, itemId))
      .returning();
    return deletedItem;
  }

  async deleteAllBudgetCategoryItems(
    categoryId: number,
  ) {
    const deletedItems = await this.db
      .delete(schema.budget_category_items)
      .where(eq(schema.budget_category_items.category_id, categoryId))
      .returning();
    return deletedItems;
  }

  async getTransactions(budget_id: number) {
    return await this.db
      .select()
      .from(schema.transactions)
      .where(eq(schema.transactions.budget_id, budget_id));
  }

  async getTransactionById(budget_id: number, transactionId: number) {
    const [transaction]: Array<budget_types.TTransactionResult> = await this.db
      .select()
      .from(schema.transactions)
      .where(and(
        eq(schema.transactions.id, transactionId),
        eq(schema.transactions.budget_id, budget_id),
      ));
    return transaction;
  }

  async createTransaction(
    transaction: budget_types.TTransactionToCreate,
  ) {
    const [newTransaction]: Array<budget_types.TTransactionResult> = await this.db
      .insert(schema.transactions)
      .values(transaction)
      .returning();
    return newTransaction;
  }

  async updateTransaction(
    budget_id: number,
    transaction_id: number,
    transaction: budget_types.TTransactionToUpdate,
  ) {
    const [updatedTransaction]: Array<budget_types.TTransactionResult> = await this.db
      .update(schema.transactions)
      .set(transaction)
      .where(
        and(
          eq(schema.transactions.id, transaction_id),
          eq(schema.transactions.budget_id, budget_id),
        ),
      )
      .returning();
    return updatedTransaction;
  }

  async deleteTransaction(budget_id: number, transaction_id: number) {
    const [deletedTransaction]: Array<budget_types.TTransactionResult> = await this.db
      .delete(schema.transactions)
      .where(
        and(
          eq(schema.transactions.id, transaction_id),
          eq(schema.transactions.budget_id, budget_id),
        ),
      )
      .returning();
    return deletedTransaction;
  }

  async getTransactionTypes(budget_id: number) {
    return await this.db.select().from(schema.transaction_types).where(eq(schema.transaction_types.budget_id, budget_id));
  }

  async getTransactionTypeById(
    budget_id: number,
    transaction_type_id: number,
  ) {
    const [transactionType]: Array<budget_types.TTransactionTypeResult> = await this.db
      .select()
      .from(schema.transaction_types)
      .where(and(
        eq(schema.transaction_types.id, transaction_type_id),
        eq(schema.transaction_types.budget_id, budget_id),
      ));
    return transactionType;
  }

  async createTransactionType(
    transaction: budget_types.TTransactionTypeToCreate,
  ) {
    const [newTransactionType]: Array<budget_types.TTransactionTypeResult> = await this.db
      .insert(schema.transaction_types)
      .values(transaction)
      .returning();
    return newTransactionType;
  }

  async updateTransactionType(
    budget_id: number,
    type_id: number,
    type: budget_types.TTransactionTypeToUpdate,
  ) {
    const [updatedTransactionType]: Array<budget_types.TTransactionTypeResult>
      = await this.db
        .update(schema.transaction_types)
        .set(type)
        .where(and(
          eq(schema.transaction_types.id, type_id),
          eq(schema.transaction_types.budget_id, budget_id),
        ))
        .returning();
    return updatedTransactionType;
  }

  async deleteTransactionType(
    budget_id: number,
    type_id: number,
  ) {
    const [updatedTransactionType]: Array<budget_types.TTransactionTypeResult>
      = await this.db
        .delete(schema.transaction_types)
        .where(and(
          eq(schema.transaction_types.id, type_id),
          eq(schema.transaction_types.budget_id, budget_id),
        ))
        .returning();
    return updatedTransactionType;
  }
}
