import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

import type {
  TBudgetCategory,
  TBudgetCategoryItem,
  TInsertBudget,
  TTransaction,
  TTransactionType,
  TUpdateBudget,
  TUpdateBudgetCategory,
  TUpdateBudgetCategoryItem,
} from "@/db/types";
import type { BudgetService } from "@/services/budget-service";

import { prepareResponse, STATUS_CODES } from "@/utils/http";

export class BudgetHandlers {
  private budgetService: BudgetService;

  constructor(budgetService: BudgetService) {
    this.budgetService = budgetService;
  }

  async getBudgetsHandler(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = request.user.user_id; // Get the user_id from the authenticated user, which is available via the fastify/jwt plugin as the plugin protects the routes and sends the user object to the request object if the user is authenticated
      const budgets = await this.budgetService.getBudgets(userId);
      reply
        .code(STATUS_CODES.OK)
        .send(
          prepareResponse(
            budgets,
            STATUS_CODES.OK,
            "Budgets fetched successfully",
            null,
          ),
        );
    }
    catch (error) {
      const errorMessage
        = error instanceof Error
          ? error.message
          : "An error occurred while fetching the budgets";
      reply
        .code(STATUS_CODES.BAD_REQUEST)
        .send(
          prepareResponse(
            null,
            STATUS_CODES.BAD_REQUEST,
            "Failed to fetch budgets",
            new Error(errorMessage),
          ),
        );
    }
  }

  async getBudgetByIdHandler(
    request: FastifyRequest<{
      Params: { budget_id: number };
    }>,
    reply: FastifyReply,
  ) {
    try {
      const budget = await this.budgetService.getBudgetById(request.user.user_id, request.params.budget_id);
      if (!budget) {
        reply.code(STATUS_CODES.NOT_FOUND).send(
          prepareResponse(
            null,
            STATUS_CODES.NOT_FOUND,
            "Budget not found",
            null,
          ),
        );
      }
      reply
        .code(STATUS_CODES.OK)
        .send(
          prepareResponse(
            budget,
            STATUS_CODES.OK,
            "Budget fetched successfully",
            null,
          ),
        );
    }
    catch (error) {
      const errorMessage
        = error instanceof Error
          ? error.message
          : "An error occurred while fetching the budget";
      reply
        .code(STATUS_CODES.BAD_REQUEST)
        .send(
          prepareResponse(
            null,
            STATUS_CODES.BAD_REQUEST,
            "Failed to fetch budget",
            new Error(errorMessage),
          ),
        );
    }
  }

  async createBudgetHandler(
    request: FastifyRequest<{
      Body: TInsertBudget;
    }>,
    reply: FastifyReply,
  ) {
    try {
      const budget: TInsertBudget = {
        ...request.body,
        user_id: request.user.user_id,
      };
      const createdBudget = await this.budgetService.createBudget(budget);
      reply
        .code(STATUS_CODES.CREATED)
        .send(
          prepareResponse(
            createdBudget,
            STATUS_CODES.CREATED,
            "Budget created successfully",
            null,
          ),
        );
    }
    catch (error) {
      const errorMessage
        = error instanceof Error
          ? error.message
          : "An error occurred while creating the budget";
      reply
        .code(STATUS_CODES.BAD_REQUEST)
        .send(
          prepareResponse(
            null,
            STATUS_CODES.BAD_REQUEST,
            errorMessage,
            new Error(errorMessage),
          ),
        );
    }
  }

  async updateBudgetHandler(
    request: FastifyRequest<{
      Body: TUpdateBudget;
      Params: { budget_id: number };
    }>,
    reply: FastifyReply,
  ) {
    try {
      const updatedBudget = await this.budgetService.updateBudget(request.user.user_id, request.params.budget_id, request.body);

      if (!updatedBudget) {
        reply.code(STATUS_CODES.NOT_FOUND).send(
          prepareResponse(
            null,
            STATUS_CODES.NOT_FOUND,
            "Budget not found",
            null,
          ),
        );
      }

      reply
        .code(STATUS_CODES.OK)
        .send(
          prepareResponse(
            updatedBudget,
            STATUS_CODES.OK,
            "Budget updated successfully",
            null,
          ),
        );
    }
    catch (error) {
      const errorMessage
        = error instanceof Error
          ? error.message
          : "An error occurred while updating the budget";
      reply
        .code(STATUS_CODES.BAD_REQUEST)
        .send(
          prepareResponse(
            null,
            STATUS_CODES.BAD_REQUEST,
            "Failed to update budget",
            new Error(errorMessage),
          ),
        );
    }
  }

  async deleteBudgetHandler(
    request: FastifyRequest<{
      Params: { budget_id: number };
    }>,
    reply: FastifyReply,
  ) {
    try {
      const deletedBudget = await this.budgetService.deleteBudget(request.user.user_id, request.params.budget_id);

      if (!deletedBudget) {
        reply.code(STATUS_CODES.NOT_FOUND).send(
          prepareResponse(
            null,
            STATUS_CODES.NOT_FOUND,
            "Budget not found",
            null,
          ),
        );
      }

      reply.send(
        prepareResponse(
          deletedBudget,
          STATUS_CODES.OK,
          "Budget deleted successfully",
          null,
        ),
      );
    }
    catch (error) {
      const errorMessage
        = error instanceof Error
          ? error.message
          : "An error occurred while deleting the budget";
      reply.send(
        prepareResponse(
          null,
          STATUS_CODES.BAD_REQUEST,
          "Failed to delete budget",
          new Error(errorMessage),
        ),
      );
    }
  }

  async getBudgetCategoriesHandler(
    request: FastifyRequest<{
      Params: { budget_id: number };
    }>,
    reply: FastifyReply,
  ) {
    try {
      // Confirm the budget exists before fetching its categories
      const budgetExists = await this.budgetService.getBudgetById(request.user.user_id, request.params.budget_id);

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

      // Fetch the categories for the budget
      const categories
        = await this.budgetService.getBudgetCategories(request.params.budget_id);
      reply.send(
        prepareResponse(
          categories,
          STATUS_CODES.OK,
          "Budget categories fetched successfully",
          null,
        ),
      );
    }
    catch (error) {
      const errorMessage
        = error instanceof Error
          ? error.message
          : "An error occurred while fetching the budget categories";
      reply.send(
        prepareResponse(
          error,
          STATUS_CODES.BAD_REQUEST,
          "Failed to fetch categories for the budget",
          new Error(errorMessage),
        ),
      );
    }
  }

  async getBudgetCategoryByIdHandler(
    request: FastifyRequest<{
      Params: { category_id: number; budget_id: number };
    }>,
    reply: FastifyReply,
  ) {
    try {
      // Confirm the budget exists before fetching the category
      const budgetExists = await this.budgetService.getBudgetById(request.user.user_id, request.params.budget_id);

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

      // Fetch the category for the budget
      const categoryExists
        = await this.budgetService.getBudgetCategoryById(request.params.budget_id, request.params.category_id);

      // If the category does not exist, return a 404 response
      if (!categoryExists) {
        reply.code(STATUS_CODES.NOT_FOUND).send(
          prepareResponse(
            null,
            STATUS_CODES.NOT_FOUND,
            "Budget category not found",
            null,
          ),
        );
      }

      reply.code(STATUS_CODES.OK).send(
        prepareResponse(
          categoryExists,
          STATUS_CODES.OK,
          "Budget category fetched successfully",
          null,
        ),
      );
    }
    catch (error) {
      const errorMessage
        = error instanceof Error
          ? error.message
          : "An error occurred while fetching the budget category";
      reply
        .code(STATUS_CODES.BAD_REQUEST)
        .send(
          prepareResponse(
            error,
            STATUS_CODES.BAD_REQUEST,
            "Failed to fetch category for the budget",
            new Error(errorMessage),
          ),
        );
    }
  }

  async createBudgetCategoryHandler(
    request: FastifyRequest<{
      Body: TBudgetCategory; // the request body should only contain the category_name and category_description as the budget_id will be taken from the URL params (but it is a FK to the budgets table, hence it is required in the database schema and used in the insert query)
      Params: { budget_id: number };
    }>,
    reply: FastifyReply,
  ) {
    try {
      // Confirm the budget exists before creating the category
      const budgetExists = await this.budgetService.getBudgetById(request.user.user_id, request.params.budget_id);

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

      const new_category: TBudgetCategory = {
        ...request.body,
        budget_id: request.params.budget_id,
      };
      const createdCategory
        = await this.budgetService.createBudgetCategory(new_category);
      reply
        .code(STATUS_CODES.CREATED)
        .send(
          prepareResponse(
            createdCategory,
            STATUS_CODES.CREATED,
            "Budget category created successfully",
            null,
          ),
        );
    }
    catch (error) {
      const errorMessage
        = error instanceof Error
          ? error.message
          : "An error occurred while creating the budget category";
      reply
        .code(STATUS_CODES.BAD_REQUEST)
        .send(
          prepareResponse(
            error,
            STATUS_CODES.BAD_REQUEST,
            "Failed to create category for the budget",
            new Error(errorMessage),
          ),
        );
    }
  }

  async updateBudgetCategoryHandler(
    request: FastifyRequest<{
      Body: TUpdateBudgetCategory;
      Params: { category_id: number; budget_id: number };
    }>,
    reply: FastifyReply,
  ) {
    try {
      // Confirm the budget exists before updating the category
      const budgetExists = await this.budgetService.getBudgetById(request.user.user_id, request.params.budget_id);

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

      // Update the category for the budget
      const budgetToUpdateExists
        = await this.budgetService.updateBudgetCategory(request.params.budget_id, request.params.category_id, request.body);

      // If the category does not exist, return a 404 response
      if (!budgetToUpdateExists) {
        reply.code(STATUS_CODES.NOT_FOUND).send(
          prepareResponse(
            null,
            STATUS_CODES.NOT_FOUND,
            "Budget category not found",
            null,
          ),
        );
      }

      reply
        .code(STATUS_CODES.OK)
        .send(
          prepareResponse(
            budgetToUpdateExists,
            STATUS_CODES.OK,
            "Budget category updated successfully",
            null,
          ),
        );
    }
    catch (error) {
      const errorMessage
        = error instanceof Error
          ? error.message
          : "An error occurred while updating the budget category";
      reply.send(
        prepareResponse(
          error,
          STATUS_CODES.BAD_REQUEST,
          "Failed to update category for the budget",
          new Error(errorMessage),
        ),
      );
    }
  }

  async deleteBudgetCategoryHandler(
    request: FastifyRequest<{
      Params: { category_id: number };
    }>,
    reply: FastifyReply,
  ) {
    try {
      // Confirm the budget exists before deleting the category
      const budgetExists = await this.budgetService.getBudgetById(request.user.user_id, request.params.budget_id);

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

      // Delete the category for the budget
      const categoryToDeleteExists
        = await this.budgetService.deleteBudgetCategory(request.params.category_id);

      // If the category does not exist, return a 404 response
      if (!categoryToDeleteExists) {
        reply.code(STATUS_CODES.NOT_FOUND).send(
          prepareResponse(
            null,
            STATUS_CODES.NOT_FOUND,
            "Budget category not found",
            null,
          ),
        );
      }

      reply
        .code(STATUS_CODES.OK)
        .send(
          prepareResponse(
            categoryToDeleteExists,
            STATUS_CODES.OK,
            "Budget category deleted successfully",
            null,
          ),
        );
    }
    catch (error) {
      const errorMessage
        = error instanceof Error
          ? error.message
          : "An error occurred while deleting the budget category";
      reply
        .code(STATUS_CODES.BAD_REQUEST)
        .send(
          prepareResponse(
            error,
            STATUS_CODES.BAD_REQUEST,
            "Failed to delete category for the budget",
            new Error(errorMessage),
          ),
        );
    }
  }

  async getBudgetCategoryItemsHandler(
    request: FastifyRequest<{
      Params: { category_id: number; budget_id: number };
    }>,
    reply: FastifyReply,
  ) {
    try {
      const { category_id, budget_id } = request.params;

      // Confirm the budget exists before fetching the category items
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

      // Confirm the category exists before fetching the category items
      const categoryExists = await this.budgetService.getBudgetCategoryById(budget_id, category_id);

      // If the category does not exist, return a 404 response
      if (!categoryExists) {
        reply.code(STATUS_CODES.NOT_FOUND).send(
          prepareResponse(
            null,
            STATUS_CODES.NOT_FOUND,
            "Budget category not found",
            null,
          ),
        );
      }

      // Fetch the items for the category
      const items = await this.budgetService.getBudgetCategoryItems(budget_id, category_id);
      reply
        .code(STATUS_CODES.OK)
        .send(
          prepareResponse(
            items,
            STATUS_CODES.OK,
            "Budget category items fetched successfully",
            null,
          ),
        );
    }
    catch (error) {
      const errorMessage
        = error instanceof Error
          ? error.message
          : "An error occurred while fetching the budget category items";
      reply
        .code(STATUS_CODES.BAD_REQUEST)
        .send(
          prepareResponse(
            error,
            STATUS_CODES.BAD_REQUEST,
            "Failed to fetch items for the budget category",
            new Error(errorMessage),
          ),
        );
    }
  }

  async getBudgetCategoryItemByIdHandler(
    request: FastifyRequest<{
      Params: { item_id: number; budget_id: number; category_id: number };
    }>,
    reply: FastifyReply,
  ) {
    try {
      const { item_id, budget_id, category_id } = request.params;

      // Confirm the budget exists before fetching the category item
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

      // Confirm the category exists before fetching the category item
      const categoryExists = await this.budgetService.getBudgetCategoryById(budget_id, category_id);

      // If the category does not exist, return a 404 response
      if (!categoryExists) {
        reply.code(STATUS_CODES.NOT_FOUND).send(
          prepareResponse(
            null,
            STATUS_CODES.NOT_FOUND,
            "Budget category not found",
            null,
          ),
        );
      }

      // Fetch the item for the category
      const itemForCategoryExists = await this.budgetService.getBudgetCategoryItemById(
        category_id,
        item_id,
      );

      // If the item does not exist, return a 404 response
      if (!itemForCategoryExists) {
        reply
          .code(STATUS_CODES.NOT_FOUND)
          .send(
            prepareResponse(
              null,
              STATUS_CODES.NOT_FOUND,
              "Budget category item not found",
              null,
            ),
          );
      }

      reply
        .code(STATUS_CODES.OK)
        .send(
          prepareResponse(
            itemForCategoryExists,
            STATUS_CODES.OK,
            "Budget category item fetched successfully",
            null,
          ),
        );
    }
    catch (error) {
      const errorMessage
        = error instanceof Error
          ? error.message
          : "An error occurred while fetching the budget category item";
      reply
        .code(STATUS_CODES.BAD_REQUEST)
        .send(
          prepareResponse(
            error,
            STATUS_CODES.BAD_REQUEST,
            "Failed to fetch item for the budget category",
            new Error(errorMessage),
          ),
        );
    }
  }

  async createBudgetCategoryItemHandler(
    request: FastifyRequest<{
      Body: TBudgetCategoryItem;
      Params: { budget_id: number; category_id: number };
    }>,
    reply: FastifyReply,
  ) {
    try {
      const { budget_id, category_id } = request.params;

      // Confirm the budget exists before creating the category item
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

      // Confirm the category exists before creating the category item
      const categoryExists = await this.budgetService.getBudgetCategoryById(budget_id, category_id);

      // If the category does not exist, return a 404 response
      if (!categoryExists) {
        reply.code(STATUS_CODES.NOT_FOUND).send(
          prepareResponse(
            null,
            STATUS_CODES.NOT_FOUND,
            "Budget category not found",
            null,
          ),
        );
      }

      const itemToCreate: TBudgetCategoryItem = {
        ...request.body,
        budget_id,
        category_id,
      };

      const createdItem = await this.budgetService.createBudgetCategoryItem(itemToCreate);
      reply
        .code(STATUS_CODES.CREATED)
        .send(
          prepareResponse(
            createdItem,
            STATUS_CODES.CREATED,
            "Budget category item created successfully",
            null,
          ),
        );
    }
    catch (error) {
      const errorMessage
        = error instanceof Error
          ? error.message
          : "An error occurred while creating the budget category item";
      reply
        .code(STATUS_CODES.BAD_REQUEST)
        .send(
          prepareResponse(
            error,
            STATUS_CODES.BAD_REQUEST,
            "Failed to create item for the budget category",
            new Error(errorMessage),
          ),
        );
    }
  }

  async updateBudgetCategoryItemHandler(
    request: FastifyRequest<{
      Body: TUpdateBudgetCategoryItem;
      Params: { budget_id: number; category_id: number; item_id: number };
    }>,
    reply: FastifyReply,
  ) {
    try {
      const { category_id, budget_id, item_id } = request.params;

      // Confirm the budget exists before updating the category item
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

      // Confirm the category exists before updating the category item
      const categoryExists = await this.budgetService.getBudgetCategoryById(budget_id, category_id);

      // If the category does not exist, return a 404 response
      if (!categoryExists) {
        reply.code(STATUS_CODES.NOT_FOUND).send(
          prepareResponse(
            null,
            STATUS_CODES.NOT_FOUND,
            "Budget category not found",
            null,
          ),
        );
      }

      // Confirm the item exists before updating the category item
      const itemToUpdateExists = await this.budgetService.getBudgetCategoryItemById(
        category_id,
        item_id,
      );

      // If the item does not exist, return a 404 response
      if (!itemToUpdateExists) {
        reply.code(STATUS_CODES.NOT_FOUND).send(
          prepareResponse(
            null,
            STATUS_CODES.NOT_FOUND,
            "Budget category item not found",
            null,
          ),
        );
      }

      const updatedItem
        = await this.budgetService.updateBudgetCategoryItem(item_id, request.body);

      reply
        .code(STATUS_CODES.OK)
        .send(
          prepareResponse(
            updatedItem,
            STATUS_CODES.OK,
            "Budget category item updated successfully",
            null,
          ),
        );
    }
    catch (error) {
      const errorMessage
        = error instanceof Error
          ? error.message
          : "An error occurred while updating the budget category item";
      reply.send(
        prepareResponse(
          error,
          STATUS_CODES.BAD_REQUEST,
          "Failed to update item for the budget category",
          new Error(errorMessage),
        ),
      );
    }
  }

  async deleteBudgetCategoryItemHandler(
    request: FastifyRequest<{
      Body: TUpdateBudgetCategoryItem;
      Params: { budget_id: number; category_id: number; item_id: number };
    }>,
    reply: FastifyReply,
  ) {
    try {
      const { category_id, budget_id, item_id } = request.params;

      // Confirm the budget exists before updating the category item
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

      // Confirm the category exists before updating the category item
      const categoryExists = await this.budgetService.getBudgetCategoryById(budget_id, category_id);

      // If the category does not exist, return a 404 response
      if (!categoryExists) {
        reply.code(STATUS_CODES.NOT_FOUND).send(
          prepareResponse(
            null,
            STATUS_CODES.NOT_FOUND,
            "Budget category not found",
            null,
          ),
        );
      }

      // Confirm the item exists before updating the category item
      const itemToDeleteExists = await this.budgetService.getBudgetCategoryItemById(
        category_id,
        item_id,
      );

      // If the item does not exist, return a 404 response
      if (!itemToDeleteExists) {
        reply.code(STATUS_CODES.NOT_FOUND).send(
          prepareResponse(
            null,
            STATUS_CODES.NOT_FOUND,
            "Budget category item not found",
            null,
          ),
        );
      }

      const deletedItem
        = await this.budgetService.deleteBudgetCategoryItem(item_id);

      reply
        .code(STATUS_CODES.OK)
        .send(
          prepareResponse(
            deletedItem,
            STATUS_CODES.OK,
            "Budget category item deleted successfully",
            null,
          ),
        );
    }
    catch (error) {
      const errorMessage
        = error instanceof Error
          ? error.message
          : "An error occurred while deleting the budget category item";
      reply.send(
        prepareResponse(
          error,
          STATUS_CODES.BAD_REQUEST,
          "Failed to delete item for the budget category",
          new Error(errorMessage),
        ),
      );
    }
  }

  async deleteAllBudgetCategoryItemsHandler(
    request: FastifyRequest<{
      Body: TUpdateBudgetCategoryItem;
      Params: { budget_id: number; category_id: number };
    }>,
    reply: FastifyReply,
  ) {
    try {
      const { category_id, budget_id } = request.params;

      // Confirm the budget exists before updating the category item
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

      // Confirm the category exists before updating the category item
      const categoryExists = await this.budgetService.getBudgetCategoryById(budget_id, category_id);

      // If the category does not exist, return a 404 response
      if (!categoryExists) {
        reply.code(STATUS_CODES.NOT_FOUND).send(
          prepareResponse(
            null,
            STATUS_CODES.NOT_FOUND,
            "Budget category not found",
            null,
          ),
        );
      }

      // Confirm there are items to delete
      const itemsToDelete = await this.budgetService.getBudgetCategoryItems(budget_id, category_id);

      // If there are no items to delete, return a 404 response
      if (!itemsToDelete.length) {
        reply.code(STATUS_CODES.NOT_FOUND).send(
          prepareResponse(
            null,
            STATUS_CODES.NOT_FOUND,
            "No items found to delete",
            null,
          ),
        );
      }

      const deletedItems = await this.budgetService.deleteAllBudgetCategoryItems(category_id);

      reply
        .code(STATUS_CODES.OK)
        .send(
          prepareResponse(
            deletedItems,
            STATUS_CODES.OK,
            "Budget category items deleted successfully",
            null,
          ),
        );
    }
    catch (error) {
      const errorMessage
        = error instanceof Error
          ? error.message
          : "An error occurred while deleting the budget category item";
      reply.send(
        prepareResponse(
          error,
          STATUS_CODES.BAD_REQUEST,
          "Failed to delete all items for the budget category",
          new Error(errorMessage),
        ),
      );
    }
  }

  async getTransactionsHandler(
    request: FastifyRequest<{
      Params: { budget_id: number };
    }>,
    reply: FastifyReply,
  ) {
    try {
      const budget_id = request.params.budget_id;
      const transactions = await this.budgetService.getTransactions(request.user.user_id, budget_id);
      reply.send(
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
      reply.send(
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
      const transaction_id = request.params.transaction_id;
      const budget_id = request.params.budget_id;
      const transaction = await this.budgetService.getTransactionById(
        request.user.user_id,
        budget_id,
        transaction_id,
      );

      if (!transaction) {
        reply.send(
          prepareResponse(
            null,
            STATUS_CODES.NOT_FOUND,
            "Transaction not found",
            null,
          ),
        );
      }

      reply.send(
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
      reply.send(
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
      Body: TTransaction;
    }>,
    reply: FastifyReply,
  ) {
    try {
      const transaction = request.body;
      const createdTransaction
        = await this.budgetService.createTransaction(request.user.user_id, transaction);
      reply.send(
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
      reply.send(
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
      Body: TTransaction;
      Params: { transaction_id: number; budget_id: number };
    }>,
    reply: FastifyReply,
  ) {
    try {
      const transaction = request.body;
      const { budget_id, transaction_id } = request.params;
      const updatedTransaction = await this.budgetService.updateTransaction(
        request.user.user_id,
        budget_id,
        transaction_id,
        transaction,
      );

      if (!updatedTransaction) {
        reply.send(
          prepareResponse(
            null,
            STATUS_CODES.NOT_FOUND,
            "Transaction not found",
            null,
          ),
        );
      }

      reply.send(
        prepareResponse(
          updatedTransaction,
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
      reply.send(
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
      const transaction_id = request.params.transaction_id;
      const budget_id = request.params.budget_id;
      const deletedTransaction = await this.budgetService.deleteTransaction(
        request.user.user_id,
        budget_id,
        transaction_id,
      );

      if (!deletedTransaction) {
        reply.send(
          prepareResponse(
            null,
            STATUS_CODES.NOT_FOUND,
            "Transaction not found",
            null,
          ),
        );
      }

      reply.send(
        prepareResponse(
          deletedTransaction,
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
      reply.send(
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
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    try {
      const transactionTypes = await this.budgetService.getTransactionTypes(
        request.user.user_id,
      );
      reply.send(
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
      reply.send(
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
      Params: { transaction_id: number };
    }>,
    reply: FastifyReply,
  ) {
    try {
      const transaction_id = request.params.transaction_id;
      const transactionType
        = await this.budgetService.getTransactionTypeById(request.user.user_id, transaction_id);

      if (!transactionType) {
        reply.send(
          prepareResponse(
            null,
            STATUS_CODES.NOT_FOUND,
            "Transaction type not found",
            null,
          ),
        );
      }

      reply.send(
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
      Body: TTransactionType;
    }>,
    reply: FastifyReply,
  ) {
    try {
      const transactionType = request.body;
      const createdTransactionType
        = await this.budgetService.createTransactionType(request.user.user_id, transactionType);
      reply.send(
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
      reply.send(
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
      Body: TTransactionType;
      Params: { type_id: number };
    }>,
    reply: FastifyReply,
  ) {
    try {
      const type_id = request.params.type_id;
      const transactionType = request.body;
      const updatedTransactionType
        = await this.budgetService.updateTransactionType(request.user.user_id, type_id, transactionType);

      if (!updatedTransactionType) {
        reply.send(
          prepareResponse(
            null,
            STATUS_CODES.NOT_FOUND,
            "Transaction type not found",
            null,
          ),
        );
      }

      reply.send(
        prepareResponse(
          updatedTransactionType,
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
      reply.send(
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
      Params: { transaction_id: number };
    }>,
    reply: FastifyReply,
  ) {
    try {
      const transaction_id = request.params.transaction_id;
      const deletedTransactionType
        = await this.budgetService.deleteTransactionType(request.user.user_id, transaction_id);

      if (!deletedTransactionType) {
        reply.send(
          prepareResponse(
            null,
            STATUS_CODES.NOT_FOUND,
            "Transaction type not found",
            null,
          ),
        );
      }

      reply.send(
        prepareResponse(
          deletedTransactionType,
          STATUS_CODES.OK,
          "Transaction type deleted successfully",
          null,
        ),
      );
    }
    catch (error) {
      const errorMessage
        = error instanceof Error
          ? error.message
          : "An error occurred while deleting the transaction type";
      reply.send(
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
    server.get(
      "",
      {
        schema: {
          description: "This endpoint will return all the budgets a user has created. To get the budgets categories, items, and transactions, you can use the respective endpoints",
          tags: ["budgets"],
          summary: "List all budgets",
          response: {},
        },
      },
      this.getBudgetsHandler.bind(this),
    );
    server.get("/:budget_id", {
      schema: {
        description: "This endpoint will return the budget with the specified id",
        tags: ["budgets"],
        summary: "Get a budget by ID",
        params: {
          type: "object",
          properties: {
            budget_id: { type: "number" },
          },
        },
        response: {},
      },
    }, this.getBudgetByIdHandler.bind(this));
    server.post("", {
      schema: {
        description: "This endpoint will create a new budget for the authenticated user",
        tags: ["budgets"],
        summary: "Create a new budget",
        body: {
          type: "object",
          properties: {
            // user_id is not required here as we can get it from the authenticated user (but it is a required field in the database schema, hence it being used in the repository)
            budget_name: { type: "string" },
            budget_description: { type: "string" },
            amount: { type: "number" },
          },
        },
        response: {},
      },
    }, this.createBudgetHandler.bind(this));
    server.put("/:budget_id", {
      schema: {
        description: "This endpoint will update the budget with the specified id",
        tags: ["budgets"],
        summary: "Update a budget by ID",
        params: {
          type: "object",
          properties: {
            budget_id: { type: "number" },
          },
        },
        body: {
          type: "object",
          properties: {
            budget_name: { type: "string" },
            budget_description: { type: "string" },
            amount: { type: "number" },
          },
        },
        response: {},
      },
    }, this.updateBudgetHandler.bind(this));
    server.delete("/:budget_id", {
      schema: {
        description: "This endpoint will delete the budget with the specified id",
        tags: ["budgets"],
        summary: "Delete a budget by ID",
        params: {
          type: "object",
          properties: {
            budget_id: { type: "number" },
          },
        },
        response: {},
      },
    }, this.deleteBudgetHandler.bind(this));
    server.get(
      "/:budget_id/categories",
      {
        schema: {
          description: "This endpoint will return all the categories for the budget with the specified id",
          tags: ["categories"],
          summary: "List all categories",
          params: {
            type: "object",
            properties: {
              budget_id: { type: "number" },
            },
          },
          response: {},
        },
      },
      this.getBudgetCategoriesHandler.bind(this),
    );
    server.get(
      "/:budget_id/categories/:category_id",
      {
        schema: {
          description: "This endpoint will return the category with the specified id",
          tags: ["categories"],
          summary: "Get a category by ID",
          params: {
            type: "object",
            properties: {
              category_id: { type: "number" },
              budget_id: { type: "number" },
            },
          },
          response: {},
        },
      },
      this.getBudgetCategoryByIdHandler.bind(this),
    );
    server.post(
      "/:budget_id/categories",
      {
        schema: {
          description: "This endpoint will create a new category for the budget with the specified id",
          tags: ["categories"],
          summary: "Create a new category",
          params: {
            type: "object",
            properties: {
              budget_id: { type: "number" },
            },
          },
          body: {
            type: "object",
            properties: {
              category_name: { type: "string" },
              category_description: { type: "string" },
            },
          },
          response: {},
        },
      },
      this.createBudgetCategoryHandler.bind(this),
    );
    server.put(
      "/:budget_id/categories/:category_id",
      {
        schema: {
          description: "This endpoint will update the category with the specified id",
          tags: ["categories"],
          summary: "Update a category by ID",
          params: {
            type: "object",
            properties: {
              category_id: { type: "number" },
              budget_id: { type: "number" },
            },
          },
          body: {
            type: "object",
            properties: {
              category_name: { type: "string" },
              category_description: { type: "string" },
            },
          },
          response: {},
        },
      },
      this.updateBudgetCategoryHandler.bind(this),
    );
    server.delete(
      "/:budget_id/categories/:category_id",
      {
        schema: {
          description: "This endpoint will delete the category with the specified id",
          tags: ["categories"],
          summary: "Delete a category by ID",
          params: {
            type: "object",
            properties: {
              category_id: { type: "number" },
              budget_id: { type: "number" },
            },
          },
          response: {},
        },
      },
      this.deleteBudgetCategoryHandler.bind(this),
    );
    server.get(
      "/:budget_id/categories/:category_id/items",
      this.getBudgetCategoryItemsHandler.bind(this),
    );
    server.get(
      "/:budget_id/categories/:category_id/items/:item_id",
      this.getBudgetCategoryItemByIdHandler.bind(this),
    );
    server.post(
      "/:budget_id/categories/:category_id/items",
      this.createBudgetCategoryItemHandler.bind(this),
    );
    server.put(
      "/:budget_id/categories/:category_id/items/:item_id",
      this.updateBudgetCategoryItemHandler.bind(this),
    );
    server.delete(
      "/:budget_id/categories/:category_id/items/:item_id",
      this.deleteBudgetCategoryItemHandler.bind(this),
    );
    server.delete(
      "/:budget_id/categories/:category_id/items",
      this.deleteAllBudgetCategoryItemsHandler.bind(this),
    );

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
      "/transaction/types",
      this.getTransactionTypesHandler.bind(this),
    );
    server.get(
      "/transaction/types/:transaction_id",
      this.getTransactionTypeByIdHandler.bind(this),
    );
    server.post(
      "/transaction/types",
      this.createTransactionTypeHandler.bind(this),
    );
    server.put(
      "/transaction/types",
      this.updateTransactionTypeHandler.bind(this),
    );
    server.delete(
      "/transaction/types/:transaction_id",
      this.deleteTransactionTypeHandler.bind(this),
    );
  }
}
