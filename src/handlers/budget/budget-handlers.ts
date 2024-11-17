import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

import { getAuth } from "@clerk/fastify";
import { z } from "zod";

import type { BudgetService } from "@/services/budget-service";

import { NotFoundError } from "@/utils/error";
import { STATUS_CODES } from "@/utils/http";

import type { TBudgetCategoryItemToCreate, TBudgetCategoryToCreate, TBudgetToCreate, TTransactionToCreate, TTransactionTypeToCreate } from "./budget-schemas";

import { errorResponseSchema } from "../error/error-schemas";
import * as budget_schemas from "./budget-schemas";

export class BudgetHandlers {
  constructor(private budgetService: BudgetService) {
    this.budgetService = budgetService;
  }

  registerHandlers(server: FastifyInstance) {
    server
      .withTypeProvider<ZodTypeProvider>()
      .route({
        method: "GET",
        url: "",
        schema: {
          summary: "Get all budgets",
          tags: ["budgets"],
          response: {
            [STATUS_CODES.OK]: budget_schemas.foundBudgetsResponse,
            "4xx": errorResponseSchema,
            "5xx": errorResponseSchema,
          },
        },
        handler: async (request, reply) => {
          const user = request.user; // Get the user_id from the authenticated user, which is available via the fastify/jwt plugin as the plugin protects the routes and sends the user object to the request object if the user is authenticated
          const budgets = await this.budgetService.getBudgets(user.id);
          reply
            .code(STATUS_CODES.OK)
            .send({
              data: budgets,
              message: "Budgets fetched successfully",
            });
        },
      });
    server
      .withTypeProvider<ZodTypeProvider>()
      .route({
        method: "GET",
        url: "/:budget_id",
        schema: {
          summary: "Get budget by id",
          tags: ["budgets"],
          params: z.object({
            budget_id: z.string(),
          }),
          response: {
            [STATUS_CODES.OK]: budget_schemas.foundBudgetResponseSchema,
            "4xx": errorResponseSchema,
            "5xx": errorResponseSchema,
          },
        },
        handler: async (request, reply) => {
          const { budget_id } = request.params;
          const budget = await this.budgetService.getBudgetById(request.user.id, Number.parseInt(budget_id));
          if (!budget) {
            throw new NotFoundError("Budget not found", [`budget with id ${budget_id} could not be found`]);
          }
          reply
            .code(STATUS_CODES.OK)
            .send({
              data: budget,
              message: "Budget fetched successfully",
            });
        },
      });
    server
      .withTypeProvider<ZodTypeProvider>()
      .route({
        url: "",
        method: "POST",
        schema: {
          summary: "Create a budget",
          tags: ["budgets"],
          body: budget_schemas.createBudgetSchema.omit({ user_id: true }), // Omit the user_id field from the schema as it is not required in the request body (used from the authenticated user on the request object)
          response: {
            [STATUS_CODES.CREATED]: budget_schemas.createdBudgetResponseSchema,
          },
        },
        handler: async (request, reply) => {
          const budget: TBudgetToCreate = {
            ...request.body,
            user_id: request.user.id,
          };
          const createdBudget = await this.budgetService.createBudget(budget);
          reply
            .code(STATUS_CODES.CREATED)
            .send({
              data: createdBudget,
              message: "Budget created successfully",
            });
        },
      });
    server
      .withTypeProvider<ZodTypeProvider>()
      .route({
        url: "/:budget_id",
        method: "PUT",
        schema: {
          summary: "Update a budget",
          tags: ["budgets"],
          params: z.object({
            budget_id: z.string(),
          }),
          body: budget_schemas.updateBudgetSchema,
          response: {
            [STATUS_CODES.OK]: budget_schemas.updatedBudgetResponseSchema,
            "4xx": errorResponseSchema,
            "5xx": errorResponseSchema,
          },
        },
        handler: async (request, reply) => {
          const { budget_id } = request.params;
          const updatedBudget = await this.budgetService.updateBudget(request.user.id, Number.parseInt(budget_id), request.body);
          reply
            .code(STATUS_CODES.OK)
            .send({
              data: updatedBudget,
              message: "Budget updated successfully",
            });
        },
      });
    server
      .withTypeProvider<ZodTypeProvider>()
      .route({
        url: "/:budget_id",
        method: "DELETE",
        schema: {
          summary: "Delete a budget",
          tags: ["budgets"],
          params: z.object({
            budget_id: z.string(),
          }),
          response: {
            [STATUS_CODES.OK]: budget_schemas.deletedBudgetResponseSchema,
            "4xx": errorResponseSchema,
            "5xx": errorResponseSchema,
          },
        },
        handler: async (request, reply) => {
          const { budget_id } = request.params;
          const deletedBudget = await this.budgetService.deleteBudget(request.user.id, Number.parseInt(budget_id));
          if (!deletedBudget) {
            throw new NotFoundError("Budget not found", [`budget with id ${budget_id} could not be found`]);
          }
          reply
            .code(STATUS_CODES.OK)
            .send({
              data: deletedBudget,
              message: "Budget deleted successfully",
            });
        },
      });
    server
      .withTypeProvider<ZodTypeProvider>()
      .route({
        url: "/:budget_id/categories",
        method: "GET",
        schema: {
          summary: "Get all categories for a budget",
          tags: ["categories"],
          params: z.object({
            budget_id: z.string(),
          }),
          response: {
            [STATUS_CODES.OK]: budget_schemas.foundBudgetCategoriesResponseSchema,
            "4xx": errorResponseSchema,
            "5xx": errorResponseSchema,
          },
        },
        handler: async (request, reply) => {
          const { budget_id } = request.params;
          const categories = await this.budgetService.getBudgetCategories(request.user.id, Number.parseInt(budget_id));
          reply
            .code(STATUS_CODES.OK)
            .send({
              data: categories,
              message: "Budget categories fetched successfully",
            });
        },
      });
    server
      .withTypeProvider<ZodTypeProvider>()
      .route({
        url: "/:budget_id/categories/:category_id",
        method: "GET",
        schema: {
          summary: "Get a category by id for a budget",
          tags: ["categories"],
          params: z.object({
            budget_id: z.string(),
            category_id: z.string(),
          }),
          response: {
            [STATUS_CODES.OK]: budget_schemas.foundBudgetCategoryResponseSchema,
            "4xx": errorResponseSchema,
            "5xx": errorResponseSchema,
          },
        },
        handler: async (request, reply) => {
          const { budget_id, category_id } = request.params;
          const category = await this.budgetService.getBudgetCategoryById(request.user.id, Number.parseInt(budget_id), Number.parseInt(category_id));
          reply
            .code(STATUS_CODES.OK)
            .send({
              data: category,
              message: "Budget category fetched successfully",
            });
        },
      });
    server
      .withTypeProvider<ZodTypeProvider>()
      .route({
        url: "/:budget_id/categories",
        method: "POST",
        schema: {
          summary: "Create a category for a budget",
          tags: ["categories"],
          params: z.object({
            budget_id: z.string(),
          }),
          body: budget_schemas.createBudgetCategorySchema.omit({ budget_id: true }), // Omit the budget_id field from the schema as it is not required in the request body (used from the request params)
          response: {
            [STATUS_CODES.CREATED]: budget_schemas.createdBudgetCategoryResponseSchema,
          },
        },
        handler: async (request, reply) => {
          const { budget_id } = request.params;
          const category: TBudgetCategoryToCreate = {
            ...request.body,
            budget_id: Number.parseInt(budget_id),
          };
          const createdCategory = await this.budgetService.createBudgetCategory(request.user.id, category);
          reply
            .code(STATUS_CODES.CREATED)
            .send({
              data: createdCategory,
              message: "Budget category created successfully",
            });
        },
      });
    server
      .withTypeProvider<ZodTypeProvider>()
      .route({
        url: "/:budget_id/categories/:category_id",
        method: "PUT",
        schema: {
          summary: "Update a category for a budget",
          tags: ["categories"],
          params: z.object({
            budget_id: z.string(),
            category_id: z.string(),
          }),
          body: budget_schemas.updateBudgetCategorySchema,
          response: {
            [STATUS_CODES.OK]: budget_schemas.updatedBudgetCategoryResponseSchema,
            "4xx": errorResponseSchema,
            "5xx": errorResponseSchema,
          },
        },
        handler: async (request, reply) => {
          const { budget_id, category_id } = request.params;
          const updatedCategory = await this.budgetService.updateBudgetCategory(request.user.id, Number.parseInt(budget_id), Number.parseInt(category_id), request.body);
          reply
            .code(STATUS_CODES.OK)
            .send({
              data: updatedCategory,
              message: "Budget category updated successfully",
            });
        },
      });
    server
      .withTypeProvider<ZodTypeProvider>()
      .route({
        url: "/:budget_id/categories/:category_id",
        method: "DELETE",
        schema: {
          summary: "Delete a category for a budget",
          tags: ["categories"],
          params: z.object({
            budget_id: z.string(),
            category_id: z.string(),
          }),
          response: {
            [STATUS_CODES.OK]: budget_schemas.deletedBudgetCategoryResponseSchema,
            "4xx": errorResponseSchema,
            "5xx": errorResponseSchema,
          },
        },
        handler: async (request, reply) => {
          const { budget_id, category_id } = request.params;
          const deletedCategory = await this.budgetService.deleteBudgetCategory(request.user.id, Number.parseInt(budget_id), Number.parseInt(category_id));
          reply
            .code(STATUS_CODES.OK)
            .send({
              data: deletedCategory,
              message: "Budget category deleted successfully",
            });
        },
      });
    server
      .withTypeProvider<ZodTypeProvider>()
      .route({
        url: "/:budget_id/categories/:category_id/items",
        method: "GET",
        schema: {
          summary: "Get all items for a category in a budget",
          tags: ["items"],
          params: z.object({
            budget_id: z.string(),
            category_id: z.string(),
          }),
          response: {
            [STATUS_CODES.OK]: budget_schemas.foundBudgetCategoryItemsResponseSchema,
            "4xx": errorResponseSchema,
            "5xx": errorResponseSchema,
          },
        },
        handler: async (request, reply) => {
          const { budget_id, category_id } = request.params;
          const items = await this.budgetService.getBudgetCategoryItems(request.user.id, Number.parseInt(budget_id), Number.parseInt(category_id));
          reply
            .code(STATUS_CODES.OK)
            .send({
              data: items,
              message: "Budget category items fetched successfully",
            });
        },
      });
    server
      .withTypeProvider<ZodTypeProvider>()
      .route({
        url: "/:budget_id/categories/:category_id/items/:item_id",
        method: "GET",
        schema: {
          summary: "Get an item by id for a category in a budget",
          tags: ["items"],
          params: z.object({
            budget_id: z.string(),
            category_id: z.string(),
            item_id: z.string(),
          }),
          response: {
            [STATUS_CODES.OK]: budget_schemas.foundBudgetCategoryItemResponseSchema,
            "4xx": errorResponseSchema,
            "5xx": errorResponseSchema,
          },
        },
        handler: async (request, reply) => {
          const { budget_id, category_id, item_id } = request.params;
          const item = await this.budgetService.getBudgetCategoryItemById(request.user.id, Number.parseInt(budget_id), Number.parseInt(category_id), Number.parseInt(item_id));
          reply
            .code(STATUS_CODES.OK)
            .send({
              data: item,
              message: "Budget category item fetched successfully",
            });
        },
      });
    server
      .withTypeProvider<ZodTypeProvider>()
      .route({
        url: "/:budget_id/categories/:category_id/items",
        method: "POST",
        schema: {
          summary: "Create an item for a category in a budget",
          tags: ["items"],
          params: z.object({
            budget_id: z.string(),
            category_id: z.string(),
          }),
          body: budget_schemas.createBudgetCategoryItemSchema.omit({ category_id: true, budget_id: true }), // Omit the category_id field from the schema as it is not required in the request body (used from the request params)
          response: {
            [STATUS_CODES.CREATED]: budget_schemas.createdBudgetCategoryItemResponseSchema,
          },
        },
        handler: async (request, reply) => {
          const { budget_id, category_id } = request.params;
          const item: TBudgetCategoryItemToCreate = {
            ...request.body,
            category_id: Number.parseInt(category_id),
            budget_id: Number.parseInt(budget_id),
          };
          const createdItem = await this.budgetService.createBudgetCategoryItem(request.user.id, Number.parseInt(budget_id), Number.parseInt(category_id), item);
          reply
            .code(STATUS_CODES.CREATED)
            .send({
              data: createdItem,
              message: "Budget category item created successfully",
            });
        },
      });
    server
      .withTypeProvider<ZodTypeProvider>()
      .route({
        url: "/:budget_id/categories/:category_id/items/:item_id",
        method: "PUT",
        schema: {
          summary: "Update an item for a category in a budget",
          tags: ["items"],
          params: z.object({
            budget_id: z.string(),
            category_id: z.string(),
            item_id: z.string(),
          }),
          body: budget_schemas.updateBudgetCategoryItemSchema,
          response: {
            [STATUS_CODES.OK]: budget_schemas.updatedBudgetCategoryItemResponseSchema,
            "4xx": errorResponseSchema,
            "5xx": errorResponseSchema,
          },
        },
        handler: async (request, reply) => {
          const { budget_id, category_id, item_id } = request.params;
          const updatedItem = await this.budgetService.updateBudgetCategoryItem(request.user.id, Number.parseInt(budget_id), Number.parseInt(category_id), Number.parseInt(item_id), request.body);
          reply
            .code(STATUS_CODES.OK)
            .send({
              data: updatedItem,
              message: "Budget category item updated successfully",
            });
        },
      });
    server
      .withTypeProvider<ZodTypeProvider>()
      .route({
        url: "/:budget_id/categories/:category_id/items/:item_id",
        method: "DELETE",
        schema: {
          summary: "Delete an item for a category in a budget",
          tags: ["items"],
          params: z.object({
            budget_id: z.string(),
            category_id: z.string(),
            item_id: z.string(),
          }),
          response: {
            [STATUS_CODES.OK]: budget_schemas.deletedBudgetCategoryItemResponseSchema,
            "4xx": errorResponseSchema,
            "5xx": errorResponseSchema,
          },
        },
        handler: async (request, reply) => {
          const { budget_id, category_id, item_id } = request.params;
          const deletedItem = await this.budgetService.deleteBudgetCategoryItem(request.user.id, Number.parseInt(budget_id), Number.parseInt(category_id), Number.parseInt(item_id));
          reply
            .code(STATUS_CODES.OK)
            .send({
              data: deletedItem,
              message: "Budget category item deleted successfully",
            });
        },
      });
    server
      .withTypeProvider<ZodTypeProvider>()
      .route({
        url: "/:budget_id/categories/:category_id/items",
        method: "DELETE",
        schema: {
          summary: "Delete all items for a category in a budget",
          tags: ["items"],
          params: z.object({
            budget_id: z.string(),
            category_id: z.string(),
          }),
          response: {
            [STATUS_CODES.OK]: budget_schemas.deletedAllBudgetCategoryItemResponseSchema,
            "4xx": errorResponseSchema,
            "5xx": errorResponseSchema,
          },
        },
        handler: async (request, reply) => {
          const { budget_id, category_id } = request.params;
          const deletedItems = await this.budgetService.deleteAllBudgetCategoryItems(request.user.id, Number.parseInt(budget_id), Number.parseInt(category_id));
          reply
            .code(STATUS_CODES.OK)
            .send({
              data: deletedItems,
              message: "Budget category items deleted successfully",
            });
        },
      });
    server
      .withTypeProvider<ZodTypeProvider>()
      .route({
        url: "/:budget_id/transactions",
        method: "GET",
        schema: {
          summary: "Get all transactions for a budget",
          tags: ["transactions"],
          params: z.object({
            budget_id: z.string(),
          }),
          response: {
            [STATUS_CODES.OK]: budget_schemas.foundTransactionsResponseSchema,
          },
        },
        handler: async (request, reply) => {
          const { budget_id } = request.params;
          const transactions = await this.budgetService.getTransactions(request.user.id, Number.parseInt(budget_id));
          reply
            .code(STATUS_CODES.OK)
            .send({
              data: transactions,
              message: "Transactions fetched successfully",
            });
        },
      });
    server
      .withTypeProvider<ZodTypeProvider>()
      .route({
        url: "/:budget_id/transactions/:transaction_id",
        method: "GET",
        schema: {
          summary: "Get a transaction by id for a budget",
          tags: ["transactions"],
          params: z.object({
            budget_id: z.string(),
            transaction_id: z.string(),
          }),
          response: {
            [STATUS_CODES.OK]: budget_schemas.foundTransactionResponseSchema,
            "4xx": errorResponseSchema,
            "5xx": errorResponseSchema,
          },
        },
        handler: async (request, reply) => {
          const { budget_id, transaction_id } = request.params;
          const transaction = await this.budgetService.getTransactionById(request.user.id, Number.parseInt(budget_id), Number.parseInt(transaction_id));
          reply
            .code(STATUS_CODES.OK)
            .send({
              data: transaction,
              message: "Transaction fetched successfully",
            });
        },
      });
    server
      .withTypeProvider<ZodTypeProvider>()
      .route({
        url: "/:budget_id/transactions",
        method: "POST",
        schema: {
          summary: "Create a transaction for a budget",
          tags: ["transactions"],
          params: z.object({
            budget_id: z.string(),
          }),
          body: budget_schemas.createTransactionSchema.omit({ budget_id: true }), // Omit the budget_id field from the schema as it is not required in the request body (used from the request params)
          response: {
            [STATUS_CODES.CREATED]: budget_schemas.createdTransactionResponseSchema,
          },
        },
        handler: async (request, reply) => {
          const { budget_id } = request.params;
          const transaction: TTransactionToCreate = {
            ...request.body,
            budget_id: Number.parseInt(budget_id),
          };
          const createdTransaction = await this.budgetService.createTransaction(request.user.id, transaction);
          reply
            .code(STATUS_CODES.CREATED)
            .send({
              data: createdTransaction,
              message: "Transaction created successfully",
            });
        },
      });
    server
      .withTypeProvider<ZodTypeProvider>()
      .route({
        url: "/:budget_id/transactions/:transaction_id",
        method: "PUT",
        schema: {
          summary: "Update a transaction for a budget",
          tags: ["transactions"],
          params: z.object({
            budget_id: z.string(),
            transaction_id: z.string(),
          }),
          body: budget_schemas.updateTransactionSchema, // Omit the budget_id field from the schema as it is not required in the request body (used from the request params)
          response: {
            [STATUS_CODES.OK]: budget_schemas.updatedTransactionResponseSchema,
            "4xx": errorResponseSchema,
            "5xx": errorResponseSchema,
          },
        },
        handler: async (request, reply) => {
          const { budget_id, transaction_id } = request.params;
          const updatedTransaction = await this.budgetService.updateTransaction(request.user.id, Number.parseInt(budget_id), Number.parseInt(transaction_id), request.body);
          reply
            .code(STATUS_CODES.OK)
            .send({
              data: updatedTransaction,
              message: "Transaction updated successfully",
            });
        },
      });
    server
      .withTypeProvider<ZodTypeProvider>()
      .route({
        url: "/:budget_id/transactions/:transaction_id",
        method: "DELETE",
        schema: {
          summary: "Delete a transaction for a budget",
          tags: ["transactions"],
          params: z.object({
            budget_id: z.string(),
            transaction_id: z.string(),
          }),
          response: {
            [STATUS_CODES.OK]: budget_schemas.deletedTransactionResponseSchema,
            "4xx": errorResponseSchema,
            "5xx": errorResponseSchema,
          },
        },
        handler: async (request, reply) => {
          const { budget_id, transaction_id } = request.params;
          const deletedTransaction = await this.budgetService.deleteTransaction(request.user.id, Number.parseInt(budget_id), Number.parseInt(transaction_id));
          reply
            .code(STATUS_CODES.OK)
            .send({
              data: deletedTransaction,
              message: "Transaction deleted successfully",
            });
        },
      });
    server
      .withTypeProvider<ZodTypeProvider>()
      .route({
        url: "/:budget_id/transactions/types",
        method: "GET",
        schema: {
          summary: "Get all transaction types for a budget",
          tags: ["transaction types"],
          params: z.object({
            budget_id: z.string(),
          }),
          response: {
            [STATUS_CODES.OK]: budget_schemas.foundTransactionTypesResponseSchema,
          },
        },
        handler: async (request, reply) => {
          const { budget_id } = request.params;
          const transactionTypes = await this.budgetService.getTransactionTypes(request.user.id, Number.parseInt(budget_id));
          reply
            .code(STATUS_CODES.OK)
            .send({
              data: transactionTypes,
              message: "Transaction types fetched successfully",
            });
        },
      });
    server
      .withTypeProvider<ZodTypeProvider>()
      .route({
        url: "/:budget_id/transactions/types/:transaction_type_id",
        method: "GET",
        schema: {
          summary: "Get a transaction type by id for a budget",
          tags: ["transaction types"],
          params: z.object({
            budget_id: z.string(),
            transaction_type_id: z.string(),
          }),
          response: {
            [STATUS_CODES.OK]: budget_schemas.foundTransactionTypeResponseSchema,
            "4xx": errorResponseSchema,
            "5xx": errorResponseSchema,
          },
        },
        handler: async (request, reply) => {
          const { budget_id, transaction_type_id } = request.params;
          const transactionType = await this.budgetService.getTransactionTypeById(request.user.id, Number.parseInt(budget_id), Number.parseInt(transaction_type_id));
          reply
            .code(STATUS_CODES.OK)
            .send({
              data: transactionType,
              message: "Transaction type fetched successfully",
            });
        },
      });
    server
      .withTypeProvider<ZodTypeProvider>()
      .route({
        url: "/:budget_id/transactions/types",
        method: "POST",
        schema: {
          summary: "Create a transaction type for a budget",
          tags: ["transaction types"],
          params: z.object({
            budget_id: z.string(),
          }),
          body: budget_schemas.createTransactionTypeSchema.omit({ budget_id: true }), // Omit the budget_id field from the schema as it is not required in the request body (used from the request params)
          response: {
            [STATUS_CODES.CREATED]: budget_schemas.createdTransactionTypeResponseSchema,
          },
        },
        handler: async (request, reply) => {
          const { budget_id } = request.params;
          const transactionType: TTransactionTypeToCreate = {
            ...request.body,
            budget_id: Number.parseInt(budget_id),
          };
          const createdTransactionType = await this.budgetService.createTransactionType(request.user.id, transactionType);
          reply
            .code(STATUS_CODES.CREATED)
            .send({
              data: createdTransactionType,
              message: "Transaction type created successfully",
            });
        },
      });
    server
      .withTypeProvider<ZodTypeProvider>()
      .route({
        url: "/:budget_id/transactions/types/:transaction_type_id",
        method: "PUT",
        schema: {
          summary: "Update a transaction type for a budget",
          tags: ["transaction types"],
          params: z.object({
            budget_id: z.string(),
            transaction_type_id: z.string(),
          }),
          body: budget_schemas.updateTransactionTypeSchema,
          response: {
            [STATUS_CODES.OK]: budget_schemas.updatedTransactionTypeResponseSchema,
            "4xx": errorResponseSchema,
            "5xx": errorResponseSchema,
          },
        },
        handler: async (request, reply) => {
          const { budget_id, transaction_type_id } = request.params;
          const updatedTransactionType = await this.budgetService.updateTransactionType(request.user.id, Number.parseInt(budget_id), Number.parseInt(transaction_type_id), request.body);
          reply
            .code(STATUS_CODES.OK)
            .send({
              data: updatedTransactionType,
              message: "Transaction type updated successfully",
            });
        },
      });
    server
      .withTypeProvider<ZodTypeProvider>()
      .route({
        url: "/:budget_id/transactions/types/:transaction_type_id",
        method: "DELETE",
        schema: {
          summary: "Delete a transaction type for a budget",
          tags: ["transaction types"],
          params: z.object({
            budget_id: z.string(),
            transaction_type_id: z.string(),
          }),
          response: {
            [STATUS_CODES.OK]: budget_schemas.deletedTransactionTypeResponseSchema,
            "4xx": errorResponseSchema,
            "5xx": errorResponseSchema,
          },
        },
        handler: async (request, reply) => {
          const { budget_id, transaction_type_id } = request.params;
          const deletedTransactionType = await this.budgetService.deleteTransactionType(request.user.id, Number.parseInt(budget_id), Number.parseInt(transaction_type_id));
          reply
            .code(STATUS_CODES.OK)
            .send({
              data: deletedTransactionType,
              message: "Transaction type deleted successfully",
            });
        },
      });
  }
}
