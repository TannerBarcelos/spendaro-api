import {
  TBudget,
  TBudgetCategory,
  TBudgetCategoryItem,
  TTransaction,
  TTransactionType,
} from '@/db/types';
import { BudgetService } from '@/services/budget-service';
import { prepareResponse, STATUS_CODES } from '@/utils/http';
import { FastifyRequest, FastifyReply, FastifyInstance } from 'fastify';

class BudgetHandlers {
  private budgetService: BudgetService;

  constructor(budgetService: BudgetService) {
    this.budgetService = budgetService;
  }

  async getBudgetsHandler(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = request.user.user_id; // Get the user_id from the authenticated user, which is available via the fastify/jwt plugin as the plugin protects the routes and sends the user object to the request object if the user is authenticated
      const budgets = await this.budgetService.getBudgets(userId);
      reply
        .status(STATUS_CODES.OK)
        .send(
          prepareResponse(
            budgets,
            STATUS_CODES.OK,
            'Budgets fetched successfully',
            null
          )
        );
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'An error occurred while fetching the budgets';
      reply
        .status(STATUS_CODES.BAD_REQUEST)
        .send(
          prepareResponse(
            null,
            STATUS_CODES.BAD_REQUEST,
            'Failed to fetch budgets',
            new Error(errorMessage)
          )
        );
    }
  }

  async getBudgetByIdHandler(
    request: FastifyRequest<{
      Params: { budgetId: number };
    }>,
    reply: FastifyReply
  ) {
    try {
      const user_id = request.user.user_id;
      const budgetId = request.params.budgetId;
      const budget = await this.budgetService.getBudgetById(user_id, budgetId);
      if (!budget) {
        reply
          .status(STATUS_CODES.NOT_FOUND)
          .send(
            prepareResponse(
              null,
              STATUS_CODES.NOT_FOUND,
              'Budget not found',
              null
            )
          );
      }
      reply
        .status(STATUS_CODES.OK)
        .send(
          prepareResponse(
            budget,
            STATUS_CODES.OK,
            'Budget fetched successfully',
            null
          )
        );
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'An error occurred while fetching the budget';
      reply
        .status(STATUS_CODES.BAD_REQUEST)
        .send(
          prepareResponse(
            null,
            STATUS_CODES.BAD_REQUEST,
            'Failed to fetch budget',
            new Error(errorMessage)
          )
        );
    }
  }

  async createBudgetHandler(
    request: FastifyRequest<{
      Body: TBudget;
    }>,
    reply: FastifyReply
  ) {
    try {
      const budget = {
        ...request.body,
        user_id: request.user.user_id,
      } as TBudget;
      const createdBudget = await this.budgetService.createBudget(budget);
      reply
        .status(STATUS_CODES.CREATED)
        .send(
          prepareResponse(
            createdBudget,
            STATUS_CODES.CREATED,
            'Budget created successfully',
            null
          )
        );
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'An error occurred while creating the budget';
      reply
        .status(STATUS_CODES.BAD_REQUEST)
        .send(
          prepareResponse(
            null,
            STATUS_CODES.BAD_REQUEST,
            errorMessage,
            new Error(errorMessage)
          )
        );
    }
  }

  async updateBudgetHandler(
    request: FastifyRequest<{
      Body: TBudget;
      Params: { budgetId: number };
    }>,
    reply: FastifyReply
  ) {
    try {
      const budgetPropertiesToUpdate = request.body;
      const budget_id = request.params.budgetId;

      const budgetToUpdate = {
        ...budgetPropertiesToUpdate,
        id: budget_id,
        user_id: request.user.user_id,
      } as TBudget;

      const updatedBudget =
        await this.budgetService.updateBudget(budgetToUpdate);

      if (!updatedBudget) {
        reply
          .status(STATUS_CODES.NOT_FOUND)
          .send(
            prepareResponse(
              null,
              STATUS_CODES.NOT_FOUND,
              'Budget not found',
              null
            )
          );
      }

      reply
        .status(STATUS_CODES.OK)
        .send(
          prepareResponse(
            updatedBudget,
            STATUS_CODES.UPDATE,
            'Budget updated successfully',
            null
          )
        );
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'An error occurred while updating the budget';
      reply
        .status(STATUS_CODES.BAD_REQUEST)
        .send(
          prepareResponse(
            null,
            STATUS_CODES.BAD_REQUEST,
            'Failed to update budget',
            new Error(errorMessage)
          )
        );
    }
  }

  async deleteBudgetHandler(
    request: FastifyRequest<{
      Params: { budgetId: number };
    }>,
    reply: FastifyReply
  ) {
    try {
      const budgetId = request.params.budgetId;
      const deletedBudget = await this.budgetService.deleteBudget(budgetId);

      if (!deletedBudget) {
        reply
          .status(STATUS_CODES.NOT_FOUND)
          .send(
            prepareResponse(
              null,
              STATUS_CODES.NOT_FOUND,
              'Budget not found',
              null
            )
          );
      }

      reply.send(
        prepareResponse(
          deletedBudget,
          STATUS_CODES.OK,
          'Budget deleted successfully',
          null
        )
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'An error occurred while deleting the budget';
      reply.send(
        prepareResponse(
          null,
          STATUS_CODES.BAD_REQUEST,
          'Failed to delete budget',
          new Error(errorMessage)
        )
      );
    }
  }

  async getBudgetCategoriesHandler(
    request: FastifyRequest<{
      Params: { budgetId: number };
    }>,
    reply: FastifyReply
  ) {
    try {
      const budget_id = request.params.budgetId;
      const categories =
        await this.budgetService.getBudgetCategories(budget_id);
      reply.send(
        prepareResponse(
          categories,
          STATUS_CODES.OK,
          'Budget categories fetched successfully',
          null
        )
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'An error occurred while fetching the budget categories';
      reply.send(
        prepareResponse(
          error,
          STATUS_CODES.BAD_REQUEST,
          'Failed to fetch categories for the budget',
          new Error(errorMessage)
        )
      );
    }
  }

  async getBudgetCategoryByIdHandler(
    request: FastifyRequest<{
      Params: { categoryId: number };
    }>,
    reply: FastifyReply
  ) {
    try {
      const categoryId = request.params.categoryId;
      const category =
        await this.budgetService.getBudgetCategoryById(categoryId);
      reply.send(
        prepareResponse(
          category,
          STATUS_CODES.OK,
          'Budget category fetched successfully',
          null
        )
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'An error occurred while fetching the budget category';
      reply.send(
        prepareResponse(
          error,
          STATUS_CODES.BAD_REQUEST,
          'Failed to fetch category for the budget',
          new Error(errorMessage)
        )
      );
    }
  }

  async createBudgetCategoryHandler(
    request: FastifyRequest<{
      Body: TBudgetCategory;
    }>,
    reply: FastifyReply
  ) {
    try {
      const category = request.body;
      const createdCategory =
        await this.budgetService.createBudgetCategory(category);
      reply.send(
        prepareResponse(
          createdCategory,
          STATUS_CODES.CREATED,
          'Budget category created successfully',
          null
        )
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'An error occurred while creating the budget category';
      reply.send(
        prepareResponse(
          error,
          STATUS_CODES.BAD_REQUEST,
          'Failed to create category for the budget',
          new Error(errorMessage)
        )
      );
    }
  }

  async updateBudgetCategoryHandler(
    request: FastifyRequest<{
      Body: TBudgetCategory;
    }>,
    reply: FastifyReply
  ) {
    try {
      const category = request.body;
      const updatedCategory =
        await this.budgetService.updateBudgetCategory(category);
      reply.send(
        prepareResponse(
          updatedCategory,
          STATUS_CODES.OK,
          'Budget category updated successfully',
          null
        )
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'An error occurred while updating the budget category';
      reply.send(
        prepareResponse(
          error,
          STATUS_CODES.BAD_REQUEST,
          'Failed to update category for the budget',
          new Error(errorMessage)
        )
      );
    }
  }

  async deleteBudgetCategoryHandler(
    request: FastifyRequest<{
      Params: { categoryId: number };
    }>,
    reply: FastifyReply
  ) {
    try {
      const categoryId = request.params.categoryId;
      const deletedCategory =
        await this.budgetService.deleteBudgetCategory(categoryId);
      reply.send(
        prepareResponse(
          deletedCategory,
          STATUS_CODES.OK,
          'Budget category deleted successfully',
          null
        )
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'An error occurred while deleting the budget category';
      reply.send(
        prepareResponse(
          error,
          STATUS_CODES.BAD_REQUEST,
          'Failed to delete category for the budget',
          new Error(errorMessage)
        )
      );
    }
  }

  async getBudgetCategoryItemsHandler(
    request: FastifyRequest<{
      Params: { categoryId: number };
    }>,
    reply: FastifyReply
  ) {
    try {
      const categoryId = request.params.categoryId;
      const items = await this.budgetService.getBudgetCategoryItems(categoryId);
      reply.send(
        prepareResponse(
          items,
          STATUS_CODES.OK,
          'Budget category items fetched successfully',
          null
        )
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'An error occurred while fetching the budget category items';
      reply.send(
        prepareResponse(
          error,
          STATUS_CODES.BAD_REQUEST,
          'Failed to fetch items for the budget category',
          new Error(errorMessage)
        )
      );
    }
  }

  async getBudgetCategoryItemByIdHandler(
    request: FastifyRequest<{
      Params: { itemId: number };
    }>,
    reply: FastifyReply
  ) {
    try {
      const itemId = request.params.itemId;
      const item = await this.budgetService.getBudgetCategoryItemById(itemId);
      reply.send(
        prepareResponse(
          item,
          STATUS_CODES.OK,
          'Budget category item fetched successfully',
          null
        )
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'An error occurred while fetching the budget category item';
      reply.send(
        prepareResponse(
          error,
          STATUS_CODES.BAD_REQUEST,
          'Failed to fetch item for the budget category',
          new Error(errorMessage)
        )
      );
    }
  }

  async createBudgetCategoryItemHandler(
    request: FastifyRequest<{
      Body: TBudgetCategoryItem;
    }>,
    reply: FastifyReply
  ) {
    try {
      const item = request.body;
      const createdItem =
        await this.budgetService.createBudgetCategoryItem(item);
      reply.send(
        prepareResponse(
          createdItem,
          STATUS_CODES.CREATED,
          'Budget category item created successfully',
          null
        )
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'An error occurred while creating the budget category item';
      reply.send(
        prepareResponse(
          error,
          STATUS_CODES.BAD_REQUEST,
          'Failed to create item for the budget category',
          new Error(errorMessage)
        )
      );
    }
  }

  async updateBudgetCategoryItemHandler(
    request: FastifyRequest<{
      Body: TBudgetCategoryItem;
    }>,
    reply: FastifyReply
  ) {
    try {
      const item = request.body;
      const updatedItem =
        await this.budgetService.updateBudgetCategoryItem(item);
      reply.send(
        prepareResponse(
          updatedItem,
          STATUS_CODES.OK,
          'Budget category item updated successfully',
          null
        )
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'An error occurred while updating the budget category item';
      reply.send(
        prepareResponse(
          error,
          STATUS_CODES.BAD_REQUEST,
          'Failed to update item for the budget category',
          new Error(errorMessage)
        )
      );
    }
  }

  async deleteBudgetCategoryItemHandler(
    request: FastifyRequest<{
      Params: { itemId: number };
    }>,
    reply: FastifyReply
  ) {
    try {
      const itemId = request.params.itemId;
      const deletedItem =
        await this.budgetService.deleteBudgetCategoryItem(itemId);
      reply.send(
        prepareResponse(
          deletedItem,
          STATUS_CODES.OK,
          'Budget category item deleted successfully',
          null
        )
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'An error occurred while deleting the budget category item';
      reply.send(
        prepareResponse(
          error,
          STATUS_CODES.BAD_REQUEST,
          'Failed to delete item for the budget category',
          new Error(errorMessage)
        )
      );
    }
  }

  async getTransactionsHandler(
    request: FastifyRequest<{
      Params: { budget_id: number };
    }>,
    reply: FastifyReply
  ) {
    try {
      const budget_id = request.params.budget_id;
      const transactions = await this.budgetService.getTransactions(budget_id);
      reply.send(
        prepareResponse(
          transactions,
          STATUS_CODES.OK,
          'Transactions fetched successfully',
          null
        )
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'An error occurred while fetching the transactions';
      reply.send(
        prepareResponse(
          error,
          STATUS_CODES.BAD_REQUEST,
          'Failed to fetch transactions',
          new Error(errorMessage)
        )
      );
    }
  }

  async getTransactionByIdHandler(
    request: FastifyRequest<{
      Params: { transaction_id: number; budget_id: number };
    }>,
    reply: FastifyReply
  ) {
    try {
      const transaction_id = request.params.transaction_id;
      const budget_id = request.params.budget_id;
      const transaction = await this.budgetService.getTransactionById(
        budget_id,
        transaction_id
      );
      reply.send(
        prepareResponse(
          transaction,
          STATUS_CODES.OK,
          'Transaction fetched successfully',
          null
        )
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'An error occurred while fetching the transaction';
      reply.send(
        prepareResponse(
          error,
          STATUS_CODES.BAD_REQUEST,
          'Failed to fetch transaction',
          new Error(errorMessage)
        )
      );
    }
  }

  async createTransactionHandler(
    request: FastifyRequest<{
      Body: TTransaction;
    }>,
    reply: FastifyReply
  ) {
    try {
      const transaction = request.body;
      const createdTransaction =
        await this.budgetService.createTransaction(transaction);
      reply.send(
        prepareResponse(
          createdTransaction,
          STATUS_CODES.CREATED,
          'Transaction created successfully',
          null
        )
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'An error occurred while creating the transaction';
      reply.send(
        prepareResponse(
          error,
          STATUS_CODES.BAD_REQUEST,
          'Failed to create transaction',
          new Error(errorMessage)
        )
      );
    }
  }

  async updateTransactionHandler(
    request: FastifyRequest<{
      Body: TTransaction;
      Params: { transaction_id: number; budget_id: number };
    }>,
    reply: FastifyReply
  ) {
    try {
      const transaction = request.body;
      const { budget_id, transaction_id } = request.params;
      const updatedTransaction = await this.budgetService.updateTransaction(
        budget_id,
        transaction_id,
        transaction
      );
      reply.send(
        prepareResponse(
          updatedTransaction,
          STATUS_CODES.OK,
          'Transaction updated successfully',
          null
        )
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'An error occurred while updating the transaction';
      reply.send(
        prepareResponse(
          error,
          STATUS_CODES.BAD_REQUEST,
          'Failed to update transaction',
          new Error(errorMessage)
        )
      );
    }
  }

  async deleteTransactionHandler(
    request: FastifyRequest<{
      Params: { transactionId: number; budgetId: number };
    }>,
    reply: FastifyReply
  ) {
    try {
      const transactionId = request.params.transactionId;
      const budgetId = request.params.budgetId;
      const deletedTransaction = await this.budgetService.deleteTransaction(
        budgetId,
        transactionId
      );
      reply.send(
        prepareResponse(
          deletedTransaction,
          STATUS_CODES.OK,
          'Transaction deleted successfully',
          null
        )
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'An error occurred while deleting the transaction';
      reply.send(
        prepareResponse(
          error,
          STATUS_CODES.BAD_REQUEST,
          'Failed to delete transaction',
          new Error(errorMessage)
        )
      );
    }
  }

  async getTransactionTypesHandler(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    try {
      const transactionTypes = await this.budgetService.getTransactionTypes();
      reply.send(
        prepareResponse(
          transactionTypes,
          STATUS_CODES.OK,
          'Transaction types fetched successfully',
          null
        )
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'An error occurred while fetching the transaction types';
      reply.send(
        prepareResponse(
          error,
          STATUS_CODES.BAD_REQUEST,
          'Failed to fetch transaction types',
          new Error(errorMessage)
        )
      );
    }
  }

  async getTransactionTypeByIdHandler(
    request: FastifyRequest<{
      Params: { transactionId: number };
    }>,
    reply: FastifyReply
  ) {
    try {
      const transactionId = request.params.transactionId;
      const transactionType =
        await this.budgetService.getTransactionTypeById(transactionId);
      reply.send(
        prepareResponse(
          transactionType,
          STATUS_CODES.OK,
          'Transaction type fetched successfully',
          null
        )
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'An error occurred while fetching the transaction type';
      reply.send(
        prepareResponse(
          error,
          STATUS_CODES.BAD_REQUEST,
          'Failed to fetch transaction type',
          new Error(errorMessage)
        )
      );
    }
  }

  async createTransactionTypeHandler(
    request: FastifyRequest<{
      Body: TTransactionType;
    }>,
    reply: FastifyReply
  ) {
    try {
      const transactionType = request.body;
      const createdTransactionType =
        await this.budgetService.createTransactionType(transactionType);
      reply.send(
        prepareResponse(
          createdTransactionType,
          STATUS_CODES.CREATED,
          'Transaction type created successfully',
          null
        )
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'An error occurred while creating the transaction type';
      reply.send(
        prepareResponse(
          error,
          STATUS_CODES.BAD_REQUEST,
          'Failed to create transaction type',
          new Error(errorMessage)
        )
      );
    }
  }

  async updateTransactionTypeHandler(
    request: FastifyRequest<{
      Body: TTransactionType;
    }>,
    reply: FastifyReply
  ) {
    try {
      const transactionType = request.body;
      const updatedTransactionType =
        await this.budgetService.updateTransactionType(transactionType);
      reply.send(
        prepareResponse(
          updatedTransactionType,
          STATUS_CODES.OK,
          'Transaction type updated successfully',
          null
        )
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'An error occurred while updating the transaction type';
      reply.send(
        prepareResponse(
          error,
          STATUS_CODES.BAD_REQUEST,
          'Failed to update transaction type',
          new Error(errorMessage)
        )
      );
    }
  }

  async deleteTransactionTypeHandler(
    request: FastifyRequest<{
      Params: { transactionId: number };
    }>,
    reply: FastifyReply
  ) {
    try {
      const transactionId = request.params.transactionId;
      const deletedTransactionType =
        await this.budgetService.deleteTransactionType(transactionId);
      reply.send(
        prepareResponse(
          deletedTransactionType,
          STATUS_CODES.OK,
          'Transaction type deleted successfully',
          null
        )
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'An error occurred while deleting the transaction type';
      reply.send(
        prepareResponse(
          error,
          STATUS_CODES.BAD_REQUEST,
          'Failed to delete transaction type',
          new Error(errorMessage)
        )
      );
    }
  }

  registerHandlers(server: FastifyInstance) {
    server.get('', this.getBudgetsHandler.bind(this));
    server.get('/:budgetId', this.getBudgetByIdHandler.bind(this));
    server.post('', this.createBudgetHandler.bind(this));
    server.put('/:budgetId', this.updateBudgetHandler.bind(this));
    server.delete('/:budgetId', this.deleteBudgetHandler.bind(this));

    server.get(
      '/:budgetId/categories',
      this.getBudgetCategoriesHandler.bind(this)
    );
    server.get(
      '/:budgetId/categories/:categoryId',
      this.getBudgetCategoryByIdHandler.bind(this)
    );
    server.post(
      '/:budgetId/categories',
      this.createBudgetCategoryHandler.bind(this)
    );
    server.put(
      '/:budgetId/categories',
      this.updateBudgetCategoryHandler.bind(this)
    );
    server.delete(
      '/:budgetId/categories/:categoryId',
      this.deleteBudgetCategoryHandler.bind(this)
    );

    server.get(
      '/:budgetId/categories/:categoryId/items',
      this.getBudgetCategoryItemsHandler.bind(this)
    );
    server.get(
      '/:budgetId/categories/items/:itemId',
      this.getBudgetCategoryItemByIdHandler.bind(this)
    );
    server.post(
      '/:budgetId/categories/items',
      this.createBudgetCategoryItemHandler.bind(this)
    );
    server.put(
      '/:budgetId/categories/items',
      this.updateBudgetCategoryItemHandler.bind(this)
    );
    server.delete(
      '/:budgetId/categories/items/:itemId',
      this.deleteBudgetCategoryItemHandler.bind(this)
    );

    server.get(
      '/:budgetId/transactions',
      this.getTransactionsHandler.bind(this)
    );
    server.get(
      '/:budgetId/transactions/:transactionId',
      this.getTransactionByIdHandler.bind(this)
    );
    server.post(
      '/:budgetId/transactions',
      this.createTransactionHandler.bind(this)
    );
    server.put(
      '/:budgetId/transactions/:transactionId',
      this.updateTransactionHandler.bind(this)
    );
    server.delete(
      '/:budgetId/transactions/:transactionId',
      this.deleteTransactionHandler.bind(this)
    );

    server.get(
      '/transaction/types',
      this.getTransactionTypesHandler.bind(this)
    );
    server.get(
      '/transaction/types/:transactionId',
      this.getTransactionTypeByIdHandler.bind(this)
    );
    server.post(
      '/transaction/types',
      this.createTransactionTypeHandler.bind(this)
    );
    server.put(
      '/transaction/types',
      this.updateTransactionTypeHandler.bind(this)
    );
    server.delete(
      '/transaction/types/:transactionId',
      this.deleteTransactionTypeHandler.bind(this)
    );
  }
}

export { BudgetHandlers };
