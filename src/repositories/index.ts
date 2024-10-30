import type * as budget_schemas from "@/handlers/budget/budget-schemas";
import type * as user_schemas from "@/handlers/user/user-schemas";

interface CommonMethods {
  findUserById: (user_id: number) => Promise<user_schemas.TFoundUserResult | undefined>;
}

export interface IAuthRepository extends CommonMethods {
  createUser: (user_to_create: user_schemas.TUserToCreate) => Promise<user_schemas.TFoundUserResult>;
  findUserByEmail: (user_email: string) => Promise<user_schemas.TFoundUserResult | undefined>;
}

export interface IUserRepository extends CommonMethods {
  updateUser: (user_id: number, user_to_update: user_schemas.TUserToUpdate) => Promise<user_schemas.TFoundUserResult>;
  deleteUser: (user_id: number) => Promise<user_schemas.TFoundUserResult>;
}

export interface IBudgetRepository {
  getBudgets: (user_id: number) => Promise<Array<budget_schemas.TBudgetResult>>;
  getBudgetById: (user_id: number, budget_id: number) => Promise<budget_schemas.TBudgetResult>;
  createBudget: (budget: budget_schemas.TBudgetToCreate) => Promise<budget_schemas.TBudgetResult>;
  updateBudget: (user_id: number, budget_id: number, budget_to_update: budget_schemas.TBudgetToUpdate) => Promise<budget_schemas.TBudgetResult>;
  deleteBudget: (user_id: number, budget_id: number) => Promise<budget_schemas.TBudgetResult>;
  getBudgetCategories: (budget_id: number) => Promise<Array<budget_schemas.TBudgetCategoryResult>>;
  getBudgetCategoryById: (budget_category_id: number, category_id: number) => Promise<budget_schemas.TBudgetCategoryResult>;
  createBudgetCategory: (category: budget_schemas.TBudgetCategoryToCreate) => Promise<budget_schemas.TBudgetCategoryResult>;
  updateBudgetCategory: (budget_id: number, category_id: number, category: budget_schemas.TBudgetCategoryToUpdate) => Promise<budget_schemas.TBudgetCategoryResult>;
  deleteBudgetCategory: (budget_id: number, categoryId: number) => Promise<budget_schemas.TBudgetCategoryResult>;
  getBudgetCategoryItems: (budget_id: number, category_id: number) => Promise<Array<budget_schemas.TBudgetCategoryItemResult>>;
  getBudgetCategoryItemById: (category_id: number, item_id: number) => Promise<budget_schemas.TBudgetCategoryItemResult>;
  createBudgetCategoryItem: (item: budget_schemas.TBudgetCategoryItemToCreate) => Promise<budget_schemas.TBudgetCategoryItemResult>;
  updateBudgetCategoryItem: (item_id: number, item: budget_schemas.TBudgetCategoryItemToUpdate) => Promise<budget_schemas.TBudgetCategoryItemResult>;
  deleteBudgetCategoryItem: (item_id: number) => Promise<budget_schemas.TBudgetCategoryItemResult>;
  deleteAllBudgetCategoryItems: (category_id: number) => Promise<budget_schemas.TBudgetCategoryItemResult[]>;
  getTransactions: (budget_id: number) => Promise<Array<budget_schemas.TTransactionResult>>;
  getTransactionById: (budget_id: number, transaction_id: number) => Promise<budget_schemas.TTransactionResult>;
  createTransaction: (transaction: budget_schemas.TTransactionToCreate) => Promise<budget_schemas.TTransactionResult>;
  updateTransaction: (budget_id: number, transaction_id: number, transaction: budget_schemas.TTransactionToUpdate) => Promise<budget_schemas.TTransactionResult>;
  deleteTransaction: (budget_id: number, transaction_id: number) => Promise<budget_schemas.TTransactionResult>;
  getTransactionTypes: (budget_id: number) => Promise<Array<budget_schemas.TTransactionTypeResult>>;
  getTransactionTypeById: (budget_id: number, transaction_type_id: number) => Promise<budget_schemas.TTransactionTypeResult>;
  createTransactionType: (transaction_type: budget_schemas.TTransactionTypeToCreate) => Promise<budget_schemas.TTransactionTypeResult>;
  updateTransactionType: (budget_id: number, type_id: number, transaction_type: budget_schemas.TTransactionTypeToUpdate) => Promise<budget_schemas.TTransactionTypeResult>;
  deleteTransactionType: (budget_id: number, transaction_type_id: number) => Promise<budget_schemas.TTransactionTypeResult>;
}
