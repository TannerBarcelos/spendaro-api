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

import { budgetCategoryItemNotFoundResponseSchema, budgetCategoryNotFoundResponseSchema, budgetNotFoundResponseSchema, createBudgetCategoryItemSchema, createBudgetCategorySchema, createBudgetSchema, createdBudgetCategoryItemResponseSchema, createdBudgetCategoryResponseSchema, createdBudgetResponseSchema, deletedAllBudgetCategoryItemResponseSchema, deletedBudgetCategoryItemResponseSchema, deletedBudgetCategoryResponseSchema, deletedBudgetResponseSchema, foundBudgetCategoriesResponseSchema, foundBudgetCategoryItemResponseSchema, foundBudgetCategoryItemsResponseSchema, foundBudgetCategoryResponseSchema, foundBudgetResponseSchema, foundBudgetSchema, foundBudgetsResponseSchema, foundBudgetsSchema, updateBudgetCategoryItemSchema, updateBudgetCategorySchema, updateBudgetSchema, updatedBudgetCategoryItemResponseSchema, updatedBudgetCategoryResponseSchema, updatedBudgetResponseSchema } from "./budget-schemas";

export class BudgetHandlers {
  constructor(private budgetService: BudgetService) {
    this.budgetService = budgetService;
  }

  async getTransactionsHandler(
    request: FastifyRequest<{
      Params: { budget_id: number };
    }>,
    reply: FastifyReply,
  ) {
    try {
      const { budget_id } = request.params;

      // Confirm the budget exists before fetching the transactions
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

      // Get the transactions for the budget
      const transactions = await this.budgetService.getTransactions(budget_id);
      reply
        .code(STATUS_CODES.OK)
        .send(
          prepareResponse(
            transactions,
            STATUS_CODES.OK,
            "Transactions fetched successfully",
            null,
          ),
        );
    }
    catch (error) {
      const errorMessage
        = error instanceof Error
          ? error.message
          : "An error occurred while fetching the transactions";
      reply
        .code(STATUS_CODES.BAD_REQUEST)
        .send(
          prepareResponse(
            error,
            STATUS_CODES.BAD_REQUEST,
            "Failed to fetch transactions",
            new Error(errorMessage),
          ),
        );
    }
  }

  async getTransactionByIdHandler(
    request: FastifyRequest<{
      Params: { transaction_id: number; budget_id: number };
    }>,
    reply: FastifyReply,
  ) {
    try {
      const { budget_id, transaction_id } = request.params;

      // Confirm the budget exists before fetching the transaction
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

      // Get the transaction for the budget
      const transaction = await this.budgetService.getTransactionById(
        budget_id,
        transaction_id,
      );

      // If the transaction does not exist, return a 404 response
      if (!transaction) {
        reply
          .code(STATUS_CODES.NOT_FOUND)
          .send(
            prepareResponse(
              null,
              STATUS_CODES.NOT_FOUND,
              "Transaction not found",
              null,
            ),
          );
      }

      // Send the transaction in the response
      reply
        .code(STATUS_CODES.OK)
        .send(
          prepareResponse(
            transaction,
            STATUS_CODES.OK,
            "Transaction fetched successfully",
            null,
          ),
        );
    }
    catch (error) {
      const errorMessage
        = error instanceof Error
          ? error.message
          : "An error occurred while fetching the transaction";
      reply
        .code(STATUS_CODES.BAD_REQUEST)
        .send(
          prepareResponse(
            error,
            STATUS_CODES.BAD_REQUEST,
            "Failed to fetch transaction",
            new Error(errorMessage),
          ),
        );
    }
  }

  async createTransactionHandler(
    request: FastifyRequest<{
      Params: { budget_id: number };
      Body: TTransactionToCreate;
    }>,
    reply: FastifyReply,
  ) {
    try {
      const { budget_id } = request.params;

      // Confirm the budget exists before creating the transaction
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

      const transactionToCreate: TTransactionToCreate = {
        ...request.body,
        budget_id,
      };

      const createdTransaction
        = await this.budgetService.createTransaction(transactionToCreate);
      reply
        .code(STATUS_CODES.CREATED)
        .send(
          prepareResponse(
            createdTransaction,
            STATUS_CODES.CREATED,
            "Transaction created successfully",
            null,
          ),
        );
    }
    catch (error) {
      const errorMessage
        = error instanceof Error
          ? error.message
          : "An error occurred while creating the transaction";
      reply
        .code(STATUS_CODES.BAD_REQUEST)
        .send(
          prepareResponse(
            error,
            STATUS_CODES.BAD_REQUEST,
            "Failed to create transaction",
            new Error(errorMessage),
          ),
        );
    }
  }

  async updateTransactionHandler(
    request: FastifyRequest<{
      Body: TTransactionToUpdate;
      Params: { transaction_id: number; budget_id: number };
    }>,
    reply: FastifyReply,
  ) {
    try {
      const { budget_id, transaction_id } = request.params;

      // Confirm the budget exists before updating the transaction
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

      const transactionToUpdate = await this.budgetService.updateTransaction(budget_id, transaction_id, request.body);

      if (!transactionToUpdate) {
        reply
          .code(STATUS_CODES.NOT_FOUND)
          .send(
            prepareResponse(
              null,
              STATUS_CODES.NOT_FOUND,
              "Transaction not found",
              null,
            ),
          );
      }

      reply
        .code(STATUS_CODES.OK)
        .send(
          prepareResponse(
            transactionToUpdate,
            STATUS_CODES.OK,
            "Transaction updated successfully",
            null,
          ),
        );
    }
    catch (error) {
      const errorMessage
        = error instanceof Error
          ? error.message
          : "An error occurred while updating the transaction";
      reply
        .code(STATUS_CODES.BAD_REQUEST)
        .send(
          prepareResponse(
            error,
            STATUS_CODES.BAD_REQUEST,
            "Failed to update transaction",
            new Error(errorMessage),
          ),
        );
    }
  }

  async deleteTransactionHandler(
    request: FastifyRequest<{
      Params: { transaction_id: number; budget_id: number };
    }>,
    reply: FastifyReply,
  ) {
    try {
      const { budget_id, transaction_id } = request.params;

      // Confirm the budget exists before updating the transaction
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

      const transactionToDelete = await this.budgetService.deleteTransaction(budget_id, transaction_id);

      if (!transactionToDelete) {
        reply
          .code(STATUS_CODES.NOT_FOUND)
          .send(
            prepareResponse(
              null,
              STATUS_CODES.NOT_FOUND,
              "Transaction not found",
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
            "Transaction deleted successfully",
            null,
          ),
        );
    }
    catch (error) {
      const errorMessage
        = error instanceof Error
          ? error.message
          : "An error occurred while deleting the transaction";
      reply
        .code(STATUS_CODES.BAD_REQUEST)
        .send(
          prepareResponse(
            error,
            STATUS_CODES.BAD_REQUEST,
            "Failed to delete transaction",
            new Error(errorMessage),
          ),
        );
    }
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
    server.get(
      "/:budget_id/transactions",
      this.getTransactionsHandler.bind(this),
    );
    server.get(
      "/:budget_id/transactions/:transaction_id",
      this.getTransactionByIdHandler.bind(this),
    );
    server.post(
      "/:budget_id/transactions",
      this.createTransactionHandler.bind(this),
    );
    server.put(
      "/:budget_id/transactions/:transaction_id",
      this.updateTransactionHandler.bind(this),
    );
    server.delete(
      "/:budget_id/transactions/:transaction_id",
      this.deleteTransactionHandler.bind(this),
    );
    server.get(
      "/:budget_id/transactions/types",
      this.getTransactionTypesHandler.bind(this),
    );
    server.get(
      "/:budget_id/transactions/types/:transaction_type_id",
      this.getTransactionTypeByIdHandler.bind(this),
    );
    server.post(
      "/:budget_id/transactions/types",
      this.createTransactionTypeHandler.bind(this),
    );
    server.put(
      "/:budget_id/transactions/types/:transaction_type_id",
      this.updateTransactionTypeHandler.bind(this),
    );
    server.delete(
      "/:budget_id/transactions/types/:transaction_type_id",
      this.deleteTransactionTypeHandler.bind(this),
    );
  }
}
