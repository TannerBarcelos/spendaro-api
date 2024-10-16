import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

import { z } from "zod";

import type {
  TBudgetCategoryItemToCreate,
  TBudgetCategoryItemToDelete,
  TBudgetCategoryItemToUpdate,
  TBudgetCategoryToCreate,
  TBudgetCategoryToUpdate,
  TBudgetToCreate,
  TBudgetToUpdate,
  TTransactionToCreate,
  TTransactionToUpdate,
  TTransactionTypeToCreate,
  TTransactionTypeToUpdate,
} from "@/db/types";
import type { BudgetService } from "@/services/budget-service";

import { NotFoundError } from "@/utils/error";
import { prepareResponse, STATUS_CODES } from "@/utils/http";

import { budgetCategoryItemNotFoundResponseSchema, budgetCategoryNotFoundResponseSchema, budgetNotFoundResponseSchema, createBudgetCategoryItemSchema, createBudgetCategorySchema, createBudgetSchema, createdBudgetCategoryItemResponseSchema, createdBudgetCategoryResponseSchema, createdBudgetResponseSchema, createdTransactionResponseSchema, createTransactionSchema, deletedAllBudgetCategoryItemResponseSchema, deletedBudgetCategoryItemResponseSchema, deletedBudgetCategoryResponseSchema, deletedBudgetResponseSchema, deletedTransactionResponseSchema, foundBudgetCategoriesResponseSchema, foundBudgetCategoryItemResponseSchema, foundBudgetCategoryItemsResponseSchema, foundBudgetCategoryResponseSchema, foundBudgetResponseSchema, foundBudgetSchema, foundBudgetsResponseSchema, foundBudgetsSchema, foundTransactionResponseSchema, foundTransactionsResponseSchema, transactionNotFoundResponseSchema, updateBudgetCategoryItemSchema, updateBudgetCategorySchema, updateBudgetSchema, updatedBudgetCategoryItemResponseSchema, updatedBudgetCategoryResponseSchema, updatedBudgetResponseSchema, updatedTransactionResponseSchema, updateTransactionSchema } from "./budget-schemas";

export class BudgetHandlers {
  constructor(private budgetService: BudgetService) {
    this.budgetService = budgetService;
  }

  async getTransactionTypesHandler(
    request: FastifyRequest<{
      Params: { budget_id: number };
    }>,
    reply: FastifyReply,
  ) {
    try {
      const { budget_id } = request.params;

      // Confirm the budget exists before fetching the transaction types
      const budgetExists = await this.budgetService.getBudgetById(request.user.user_id, budget_id);

      // If the budget does not exist, return a 404 response
      if (!budgetExists) {
        reply.code(STATUS_CODES.NOT_FOUND).send(
          prepareResponse(
            null,
            STATUS_CODES.NOT_FOUND,
            "Budget not found",
            null,
          ),
        );
      }

      // Fetch the transaction types for the budget
      const transactionTypes = await this.budgetService.getTransactionTypes(budget_id);
      reply
        .code(STATUS_CODES.OK)
        .send(
          prepareResponse(
            transactionTypes,
            STATUS_CODES.OK,
            "Transaction types fetched successfully",
            null,
          ),
        );
    }
    catch (error) {
      const errorMessage
        = error instanceof Error
          ? error.message
          : "An error occurred while fetching the transaction types";
      reply
        .code(STATUS_CODES.BAD_REQUEST)
        .send(
          prepareResponse(
            error,
            STATUS_CODES.BAD_REQUEST,
            "Failed to fetch transaction types",
            new Error(errorMessage),
          ),
        );
    }
  }

  async getTransactionTypeByIdHandler(
    request: FastifyRequest<{
      Params: { budget_id: number; transaction_type_id: number };
    }>,
    reply: FastifyReply,
  ) {
    try {
      const { budget_id, transaction_type_id } = request.params;

      // Confirm the budget exists before fetching the transaction type
      const budgetExists = await this.budgetService.getBudgetById(request.user.user_id, budget_id);

      // If the budget does not exist, return a 404 response
      if (!budgetExists) {
        reply.code(STATUS_CODES.NOT_FOUND).send(
          prepareResponse(
            null,
            STATUS_CODES.NOT_FOUND,
            "Budget not found",
            null,
          ),
        );
      }

      // Fetch the transaction type for the budget
      const transactionType
        = await this.budgetService.getTransactionTypeById(budget_id, transaction_type_id);

      // If the transaction type does not exist, return a 404 response
      if (!transactionType) {
        reply
          .code(STATUS_CODES.NOT_FOUND)
          .send(
            prepareResponse(
              null,
              STATUS_CODES.NOT_FOUND,
              "Transaction type not found",
              null,
            ),
          );
      }

      reply
        .code(STATUS_CODES.OK)
        .send(
          prepareResponse(
            transactionType,
            STATUS_CODES.OK,
            "Transaction type fetched successfully",
            null,
          ),
        );
    }
    catch (error) {
      const errorMessage
        = error instanceof Error
          ? error.message
          : "An error occurred while fetching the transaction type";
      reply.send(
        prepareResponse(
          error,
          STATUS_CODES.BAD_REQUEST,
          "Failed to fetch transaction type",
          new Error(errorMessage),
        ),
      );
    }
  }

  async createTransactionTypeHandler(
    request: FastifyRequest<{
      Body: TTransactionTypeToCreate;
      Params: { budget_id: number };
    }>,
    reply: FastifyReply,
  ) {
    try {
      const { budget_id } = request.params;

      // Confirm the budget exists before creating the transaction type
      const budgetExists = await this.budgetService.getBudgetById(request.user.user_id, budget_id);

      // If the budget does not exist, return a 404 response
      if (!budgetExists) {
        reply.code(STATUS_CODES.NOT_FOUND).send(
          prepareResponse(
            null,
            STATUS_CODES.NOT_FOUND,
            "Budget not found",
            null,
          ),
        );
      }

      const transactionType: TTransactionTypeToCreate = {
        ...request.body,
        budget_id,
      };

      const createdTransactionType
        = await this.budgetService.createTransactionType(transactionType);

      reply
        .code(STATUS_CODES.CREATED)
        .send(
          prepareResponse(
            createdTransactionType,
            STATUS_CODES.CREATED,
            "Transaction type created successfully",
            null,
          ),
        );
    }
    catch (error) {
      const errorMessage
        = error instanceof Error
          ? error.message
          : "An error occurred while creating the transaction type";
      reply
        .code(STATUS_CODES.BAD_REQUEST)
        .send(
          prepareResponse(
            error,
            STATUS_CODES.BAD_REQUEST,
            "Failed to create transaction type",
            new Error(errorMessage),
          ),
        );
    }
  }

  async updateTransactionTypeHandler(
    request: FastifyRequest<{
      Body: TTransactionTypeToUpdate;
      Params: { budget_id: number; transaction_type_id: number };
    }>,
    reply: FastifyReply,
  ) {
    try {
      const { transaction_type_id, budget_id } = request.params;

      // Confirm the budget exists before updating the transaction type
      const budgetExists = await this.budgetService.getBudgetById(request.user.user_id, budget_id);

      // If the budget does not exist, return a 404 response
      if (!budgetExists) {
        reply.code(STATUS_CODES.NOT_FOUND).send(
          prepareResponse(
            null,
            STATUS_CODES.NOT_FOUND,
            "Budget not found",
            null,
          ),
        );
      }

      // Update the transaction type for the budget
      const transactionTypeToUpdate
        = await this.budgetService.updateTransactionType(budget_id, transaction_type_id, request.body);

      if (!transactionTypeToUpdate) {
        reply
          .code(STATUS_CODES.NOT_FOUND)
          .send(
            prepareResponse(
              null,
              STATUS_CODES.NOT_FOUND,
              "Transaction type not found",
              null,
            ),
          );
      }

      reply
        .code(STATUS_CODES.OK)
        .send(
          prepareResponse(
            transactionTypeToUpdate,
            STATUS_CODES.OK,
            "Transaction type updated successfully",
            null,
          ),
        );
    }
    catch (error) {
      const errorMessage
        = error instanceof Error
          ? error.message
          : "An error occurred while updating the transaction type";
      reply
        .code(STATUS_CODES.BAD_REQUEST)
        .send(
          prepareResponse(
            error,
            STATUS_CODES.BAD_REQUEST,
            "Failed to update transaction type",
            new Error(errorMessage),
          ),
        );
    }
  }

  async deleteTransactionTypeHandler(
    request: FastifyRequest<{
      Params: { budget_id: number; transaction_type_id: number };
    }>,
    reply: FastifyReply,
  ) {
    try {
      const { transaction_type_id, budget_id } = request.params;

      // Confirm the budget exists before updating the transaction type
      const budgetExists = await this.budgetService.getBudgetById(request.user.user_id, budget_id);

      // If the budget does not exist, return a 404 response
      if (!budgetExists) {
        reply.code(STATUS_CODES.NOT_FOUND).send(
          prepareResponse(
            null,
            STATUS_CODES.NOT_FOUND,
            "Budget not found",
            null,
          ),
        );
      }

      // Delete the transaction type for the budget
      const transactionToDelete
        = await this.budgetService.deleteTransactionType(budget_id, transaction_type_id);

      if (!transactionToDelete) {
        reply
          .code(STATUS_CODES.NOT_FOUND)
          .send(
            prepareResponse(
              null,
              STATUS_CODES.NOT_FOUND,
              "Transaction type not found",
              null,
            ),
          );
      }

      reply
        .code(STATUS_CODES.OK)
        .send(
          prepareResponse(
            transactionToDelete,
            STATUS_CODES.OK,
            "Transaction type updated successfully",
            null,
          ),
        );
    }
    catch (error) {
      const errorMessage
        = error instanceof Error
          ? error.message
          : "An error occurred while deleting the transaction type";
      reply
        .code(STATUS_CODES.BAD_REQUEST)
        .send(
          prepareResponse(
            error,
            STATUS_CODES.BAD_REQUEST,
            "Failed to delete transaction type",
            new Error(errorMessage),
          ),
        );
    }
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
            [STATUS_CODES.OK]: foundBudgetsResponseSchema,
          },
        },
        handler: async (request, reply) => {
          const userId = request.user.user_id; // Get the user_id from the authenticated user, which is available via the fastify/jwt plugin as the plugin protects the routes and sends the user object to the request object if the user is authenticated
          const budgets = await this.budgetService.getBudgets(userId);
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
            [STATUS_CODES.OK]: foundBudgetResponseSchema,
            [STATUS_CODES.NOT_FOUND]: budgetNotFoundResponseSchema,
          },
        },
        handler: async (request, reply) => {
          const { budget_id } = request.params;
          const budget = await this.budgetService.getBudgetById(request.user.user_id, Number.parseInt(budget_id));
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
          body: createBudgetSchema.omit({ user_id: true }), // Omit the user_id field from the schema as it is not required in the request body (used from the authenticated user on the request object)
          response: {
            [STATUS_CODES.CREATED]: createdBudgetResponseSchema,
          },
        },
        handler: async (request, reply) => {
          const budget: TBudgetToCreate = {
            ...request.body,
            user_id: request.user.user_id,
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
          body: updateBudgetSchema,
          response: {
            [STATUS_CODES.OK]: updatedBudgetResponseSchema,
            [STATUS_CODES.NOT_FOUND]: budgetNotFoundResponseSchema,
          },
        },
        handler: async (request, reply) => {
          const { budget_id } = request.params;
          const updatedBudget = await this.budgetService.updateBudget(request.user.user_id, Number.parseInt(budget_id), request.body);
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
            [STATUS_CODES.OK]: deletedBudgetResponseSchema,
            [STATUS_CODES.NOT_FOUND]: budgetNotFoundResponseSchema,
          },
        },
        handler: async (request, reply) => {
          const { budget_id } = request.params;
          const deletedBudget = await this.budgetService.deleteBudget(request.user.user_id, Number.parseInt(budget_id));
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
            [STATUS_CODES.OK]: foundBudgetCategoriesResponseSchema,
            [STATUS_CODES.NOT_FOUND]: budgetCategoryNotFoundResponseSchema,
          },
        },
        handler: async (request, reply) => {
          const { budget_id } = request.params;
          const categories = await this.budgetService.getBudgetCategories(request.user.user_id, Number.parseInt(budget_id));
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
            [STATUS_CODES.OK]: foundBudgetCategoryResponseSchema,
            [STATUS_CODES.NOT_FOUND]: budgetCategoryNotFoundResponseSchema,
          },
        },
        handler: async (request, reply) => {
          const { budget_id, category_id } = request.params;
          const category = await this.budgetService.getBudgetCategoryById(request.user.user_id, Number.parseInt(budget_id), Number.parseInt(category_id));
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
          body: createBudgetCategorySchema.omit({ budget_id: true }), // Omit the budget_id field from the schema as it is not required in the request body (used from the request params)
          response: {
            [STATUS_CODES.CREATED]: createdBudgetCategoryResponseSchema,
          },
        },
        handler: async (request, reply) => {
          const { budget_id } = request.params;
          const category: TBudgetCategoryToCreate = {
            ...request.body,
            budget_id: Number.parseInt(budget_id),
          };
          const createdCategory = await this.budgetService.createBudgetCategory(request.user.user_id, category);
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
          body: updateBudgetCategorySchema,
          response: {
            [STATUS_CODES.OK]: updatedBudgetCategoryResponseSchema,
            [STATUS_CODES.NOT_FOUND]: budgetCategoryNotFoundResponseSchema,
          },
        },
        handler: async (request, reply) => {
          const { budget_id, category_id } = request.params;
          const updatedCategory = await this.budgetService.updateBudgetCategory(request.user.user_id, Number.parseInt(budget_id), Number.parseInt(category_id), request.body);
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
            [STATUS_CODES.OK]: deletedBudgetCategoryResponseSchema,
            [STATUS_CODES.NOT_FOUND]: budgetCategoryNotFoundResponseSchema,
          },
        },
        handler: async (request, reply) => {
          const { budget_id, category_id } = request.params;
          const deletedCategory = await this.budgetService.deleteBudgetCategory(request.user.user_id, Number.parseInt(budget_id), Number.parseInt(category_id));
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
            [STATUS_CODES.OK]: foundBudgetCategoryItemsResponseSchema,
            [STATUS_CODES.NOT_FOUND]: budgetCategoryItemNotFoundResponseSchema,
          },
        },
        handler: async (request, reply) => {
          const { budget_id, category_id } = request.params;
          const items = await this.budgetService.getBudgetCategoryItems(request.user.user_id, Number.parseInt(budget_id), Number.parseInt(category_id));
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
            [STATUS_CODES.OK]: foundBudgetCategoryItemResponseSchema,
            [STATUS_CODES.NOT_FOUND]: budgetCategoryItemNotFoundResponseSchema,
          },
        },
        handler: async (request, reply) => {
          const { budget_id, category_id, item_id } = request.params;
          const item = await this.budgetService.getBudgetCategoryItemById(request.user.user_id, Number.parseInt(budget_id), Number.parseInt(category_id), Number.parseInt(item_id));
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
          body: createBudgetCategoryItemSchema.omit({ category_id: true, budget_id: true }), // Omit the category_id field from the schema as it is not required in the request body (used from the request params)
          response: {
            [STATUS_CODES.CREATED]: createdBudgetCategoryItemResponseSchema,
          },
        },
        handler: async (request, reply) => {
          const { budget_id, category_id } = request.params;
          const item: TBudgetCategoryItemToCreate = {
            ...request.body,
            category_id: Number.parseInt(category_id),
            budget_id: Number.parseInt(budget_id),
          };
          const createdItem = await this.budgetService.createBudgetCategoryItem(request.user.user_id, Number.parseInt(budget_id), Number.parseInt(category_id), item);
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
          body: updateBudgetCategoryItemSchema,
          response: {
            [STATUS_CODES.OK]: updatedBudgetCategoryItemResponseSchema,
            [STATUS_CODES.NOT_FOUND]: budgetCategoryItemNotFoundResponseSchema,
          },
        },
        handler: async (request, reply) => {
          const { budget_id, category_id, item_id } = request.params;
          const updatedItem = await this.budgetService.updateBudgetCategoryItem(request.user.user_id, Number.parseInt(budget_id), Number.parseInt(category_id), Number.parseInt(item_id), request.body);
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
            [STATUS_CODES.OK]: deletedBudgetCategoryItemResponseSchema,
            [STATUS_CODES.NOT_FOUND]: budgetCategoryItemNotFoundResponseSchema,
          },
        },
        handler: async (request, reply) => {
          const { budget_id, category_id, item_id } = request.params;
          const deletedItem = await this.budgetService.deleteBudgetCategoryItem(request.user.user_id, Number.parseInt(budget_id), Number.parseInt(category_id), Number.parseInt(item_id));
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
            [STATUS_CODES.OK]: deletedAllBudgetCategoryItemResponseSchema,
            [STATUS_CODES.NOT_FOUND]: budgetCategoryItemNotFoundResponseSchema,
          },
        },
        handler: async (request, reply) => {
          const { budget_id, category_id } = request.params;
          const deletedItems = await this.budgetService.deleteAllBudgetCategoryItems(request.user.user_id, Number.parseInt(budget_id), Number.parseInt(category_id));
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
            [STATUS_CODES.OK]: foundTransactionsResponseSchema,
          },
        },
        handler: async (request, reply) => {
          const { budget_id } = request.params;
          const transactions = await this.budgetService.getTransactions(request.user.user_id, Number.parseInt(budget_id));
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
            [STATUS_CODES.OK]: foundTransactionResponseSchema,
            [STATUS_CODES.NOT_FOUND]: transactionNotFoundResponseSchema,
          },
        },
        handler: async (request, reply) => {
          const { budget_id, transaction_id } = request.params;
          const transaction = await this.budgetService.getTransactionById(request.user.user_id, Number.parseInt(budget_id), Number.parseInt(transaction_id));
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
          body: createTransactionSchema.omit({ budget_id: true }), // Omit the budget_id field from the schema as it is not required in the request body (used from the request params)
          response: {
            [STATUS_CODES.CREATED]: createdTransactionResponseSchema,
          },
        },
        handler: async (request, reply) => {
          const { budget_id } = request.params;
          const transaction: TTransactionToCreate = {
            ...request.body,
            budget_id: Number.parseInt(budget_id),
          };
          const createdTransaction = await this.budgetService.createTransaction(request.user.user_id, transaction);
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
          body: updateTransactionSchema, // Omit the budget_id field from the schema as it is not required in the request body (used from the request params)
          response: {
            [STATUS_CODES.OK]: updatedTransactionResponseSchema,
            [STATUS_CODES.NOT_FOUND]: transactionNotFoundResponseSchema,
          },
        },
        handler: async (request, reply) => {
          const { budget_id, transaction_id } = request.params;
          const updatedTransaction = await this.budgetService.updateTransaction(request.user.user_id, Number.parseInt(budget_id), Number.parseInt(transaction_id), request.body);
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
            [STATUS_CODES.OK]: deletedTransactionResponseSchema,
            [STATUS_CODES.NOT_FOUND]: transactionNotFoundResponseSchema,
          },
        },
        handler: async (request, reply) => {
          const { budget_id, transaction_id } = request.params;
          const deletedTransaction = await this.budgetService.deleteTransaction(request.user.user_id, Number.parseInt(budget_id), Number.parseInt(transaction_id));
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
            [STATUS_CODES.OK]: foundBudgetsResponseSchema,
          },
        },
        handler: this.getTransactionTypesHandler.bind(this),
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
            [STATUS_CODES.OK]: foundBudgetResponseSchema,
            [STATUS_CODES.NOT_FOUND]: budgetNotFoundResponseSchema,
          },
        },
        handler: this.getTransactionTypeByIdHandler.bind(this),
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
          body: z.object({
            name: z.string(),
          }),
          response: {
            [STATUS_CODES.CREATED]: createdBudgetResponseSchema,
          },
        },
        handler: this.createTransactionTypeHandler.bind(this),
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
          body: z.object({
            name: z.string(),
          }),
          response: {
            [STATUS_CODES.OK]: updatedBudgetResponseSchema,
            [STATUS_CODES.NOT_FOUND]: budgetNotFoundResponseSchema,
          },
        },
        handler: this.updateTransactionTypeHandler.bind(this),
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
            [STATUS_CODES.OK]: deletedBudgetResponseSchema,
            [STATUS_CODES.NOT_FOUND]: budgetNotFoundResponseSchema,
          },
        },
        handler: this.deleteTransactionTypeHandler.bind(this),
      });
  }
}
