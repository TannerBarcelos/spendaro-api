import {
  TBudget,
  TBudgetCategory,
  TBudgetCategoryItem,
  TTransaction,
  TTransactionType,
} from '@/db/schema';
import { BudgetService } from '@/services/budget-service';
import { prepareResponse, STATUS_CODES } from '@/util/http';
import { FastifyRequest, FastifyReply, FastifyInstance } from 'fastify';

class BudgetHandlers {
  private budgetService: BudgetService;

  constructor(budgetService: BudgetService) {
    this.budgetService = budgetService;
  }

  async getBudgetsHandler(_: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = 1; // TODO: Replace with user from request when auth is implemented
      const budgets = await this.budgetService.getBudgets(userId);
      reply.send(
        prepareResponse(
          budgets,
          STATUS_CODES.OK,
          'Budgets fetched successfully'
        )
      );
    } catch (error) {
      reply.send(
        prepareResponse(error, STATUS_CODES.BAD_REQUEST, 'Bad Request')
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
      const budgetId = request.params.budgetId;
      const budget = await this.budgetService.getBudgetById(budgetId);
      if (!budget) {
        reply
          .status(STATUS_CODES.NOT_FOUND)
          .send(
            prepareResponse(null, STATUS_CODES.NOT_FOUND, 'Budget not found')
          );
      }
      reply.send(
        prepareResponse(budget, STATUS_CODES.OK, 'Budget fetched successfully')
      );
    } catch (error) {
      reply.send(
        prepareResponse(error, STATUS_CODES.BAD_REQUEST, 'Bad Request')
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
      const budget = request.body;
      const createdBudget = await this.budgetService.createBudget(budget);
      reply.send(
        prepareResponse(
          createdBudget,
          STATUS_CODES.CREATED,
          'Budget created successfully'
        )
      );
    } catch (error) {
      reply.send(
        prepareResponse(
          error,
          STATUS_CODES.BAD_REQUEST,
          'Bad Request. Ensure all required fields are provided'
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
      const budget = request.body;
      const budget_id = request.params.budgetId;
      const updatedBudget = await this.budgetService.updateBudget(
        budget_id,
        budget
      );

      if (!updatedBudget) {
        reply
          .status(STATUS_CODES.NOT_FOUND)
          .send(
            prepareResponse(null, STATUS_CODES.NOT_FOUND, 'Budget not found')
          );
      }

      reply.send(
        prepareResponse(
          updatedBudget,
          STATUS_CODES.OK,
          'Budget updated successfully'
        )
      );
    } catch (error) {
      reply.send(
        prepareResponse(error, STATUS_CODES.BAD_REQUEST, 'Bad Request')
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
            prepareResponse(null, STATUS_CODES.NOT_FOUND, 'Budget not found')
          );
      }

      reply.send(
        prepareResponse(
          deletedBudget,
          STATUS_CODES.OK,
          'Budget deleted successfully'
        )
      );
    } catch (error) {
      reply.send(
        prepareResponse(error, STATUS_CODES.BAD_REQUEST, 'Bad Request')
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
          'Budget categories fetched successfully'
        )
      );
    } catch (error) {
      reply.send(
        prepareResponse(error, STATUS_CODES.BAD_REQUEST, 'Bad Request')
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
          'Budget category fetched successfully'
        )
      );
    } catch (error) {
      reply.send(
        prepareResponse(error, STATUS_CODES.BAD_REQUEST, 'Bad Request')
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
          'Budget category created successfully'
        )
      );
    } catch (error) {
      reply.send(
        prepareResponse(error, STATUS_CODES.BAD_REQUEST, 'Bad Request')
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
          'Budget category updated successfully'
        )
      );
    } catch (error) {
      reply.send(
        prepareResponse(error, STATUS_CODES.BAD_REQUEST, 'Bad Request')
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
          'Budget category deleted successfully'
        )
      );
    } catch (error) {
      reply.send(
        prepareResponse(error, STATUS_CODES.BAD_REQUEST, 'Bad Request')
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
          'Budget category items fetched successfully'
        )
      );
    } catch (error) {
      reply.send(
        prepareResponse(error, STATUS_CODES.BAD_REQUEST, 'Bad Request')
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
          'Budget category item fetched successfully'
        )
      );
    } catch (error) {
      reply.send(
        prepareResponse(error, STATUS_CODES.BAD_REQUEST, 'Bad Request')
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
          'Budget category item created successfully'
        )
      );
    } catch (error) {
      reply.send(
        prepareResponse(error, STATUS_CODES.BAD_REQUEST, 'Bad Request')
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
          'Budget category item updated successfully'
        )
      );
    } catch (error) {
      reply.send(
        prepareResponse(error, STATUS_CODES.BAD_REQUEST, 'Bad Request')
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
          'Budget category item deleted successfully'
        )
      );
    } catch (error) {
      reply.send(
        prepareResponse(error, STATUS_CODES.BAD_REQUEST, 'Bad Request')
      );
    }
  }

  async getTransactionsHandler(
    request: FastifyRequest<{
      Params: { itemId: number };
    }>,
    reply: FastifyReply
  ) {
    try {
      const itemId = request.params.itemId;
      const transactions = await this.budgetService.getTransactions(itemId);
      reply.send(
        prepareResponse(
          transactions,
          STATUS_CODES.OK,
          'Transactions fetched successfully'
        )
      );
    } catch (error) {
      reply.send(
        prepareResponse(error, STATUS_CODES.BAD_REQUEST, 'Bad Request')
      );
    }
  }

  async getTransactionByIdHandler(
    request: FastifyRequest<{
      Params: { transactionId: number };
    }>,
    reply: FastifyReply
  ) {
    try {
      const transactionId = request.params.transactionId;
      const transaction =
        await this.budgetService.getTransactionById(transactionId);
      reply.send(
        prepareResponse(
          transaction,
          STATUS_CODES.OK,
          'Transaction fetched successfully'
        )
      );
    } catch (error) {
      reply.send(
        prepareResponse(error, STATUS_CODES.BAD_REQUEST, 'Bad Request')
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
          'Transaction created successfully'
        )
      );
    } catch (error) {
      reply.send(
        prepareResponse(error, STATUS_CODES.BAD_REQUEST, 'Bad Request')
      );
    }
  }

  async updateTransactionHandler(
    request: FastifyRequest<{
      Body: TTransaction;
    }>,
    reply: FastifyReply
  ) {
    try {
      const transaction = request.body;
      const updatedTransaction =
        await this.budgetService.updateTransaction(transaction);
      reply.send(
        prepareResponse(
          updatedTransaction,
          STATUS_CODES.OK,
          'Transaction updated successfully'
        )
      );
    } catch (error) {
      reply.send(
        prepareResponse(error, STATUS_CODES.BAD_REQUEST, 'Bad Request')
      );
    }
  }

  async deleteTransactionHandler(
    request: FastifyRequest<{
      Params: { transactionId: number };
    }>,
    reply: FastifyReply
  ) {
    try {
      const transactionId = request.params.transactionId;
      const deletedTransaction =
        await this.budgetService.deleteTransaction(transactionId);
      reply.send(
        prepareResponse(
          deletedTransaction,
          STATUS_CODES.OK,
          'Transaction deleted successfully'
        )
      );
    } catch (error) {
      reply.send(
        prepareResponse(error, STATUS_CODES.BAD_REQUEST, 'Bad Request')
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
          'Transaction types fetched successfully'
        )
      );
    } catch (error) {
      reply.send(
        prepareResponse(error, STATUS_CODES.BAD_REQUEST, 'Bad Request')
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
          'Transaction type fetched successfully'
        )
      );
    } catch (error) {
      reply.send(
        prepareResponse(error, STATUS_CODES.BAD_REQUEST, 'Bad Request')
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
          'Transaction type created successfully'
        )
      );
    } catch (error) {
      reply.send(
        prepareResponse(error, STATUS_CODES.BAD_REQUEST, 'Bad Request')
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
          'Transaction type updated successfully'
        )
      );
    } catch (error) {
      reply.send(
        prepareResponse(error, STATUS_CODES.BAD_REQUEST, 'Bad Request')
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
          'Transaction type deleted successfully'
        )
      );
    } catch (error) {
      reply.send(
        prepareResponse(error, STATUS_CODES.BAD_REQUEST, 'Bad Request')
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
      'categories/:categoryId',
      this.getBudgetCategoryByIdHandler.bind(this)
    );
    server.post('categories', this.createBudgetCategoryHandler.bind(this));
    server.put('categories', this.updateBudgetCategoryHandler.bind(this));
    server.delete(
      'categories/:categoryId',
      this.deleteBudgetCategoryHandler.bind(this)
    );
    server.get(
      '/categories/:categoryId/items',
      this.getBudgetCategoryItemsHandler.bind(this)
    );
    server.get(
      '/categories/items/:itemId',
      this.getBudgetCategoryItemByIdHandler.bind(this)
    );
    server.post(
      '/categories/items',
      this.createBudgetCategoryItemHandler.bind(this)
    );
    server.put(
      '/categories/items',
      this.updateBudgetCategoryItemHandler.bind(this)
    );
    server.delete(
      '/categories/items/:itemId',
      this.deleteBudgetCategoryItemHandler.bind(this)
    );
    server.get(
      '/items/:itemId/transactions',
      this.getTransactionsHandler.bind(this)
    );
    server.get(
      '/transactions/:transactionId',
      this.getTransactionByIdHandler.bind(this)
    );
    server.post('/transactions', this.createTransactionHandler.bind(this));
    server.put('/transactions', this.updateTransactionHandler.bind(this));
    server.delete(
      '/transactions/:transactionId',
      this.deleteTransactionHandler.bind(this)
    );
    server.get(
      '/transaction-types',
      this.getTransactionTypesHandler.bind(this)
    );
    server.get(
      '/transaction-types/:transactionId',
      this.getTransactionTypeByIdHandler.bind(this)
    );
    server.post(
      '/transaction-types',
      this.createTransactionTypeHandler.bind(this)
    );
    server.put(
      '/transaction-types',
      this.updateTransactionTypeHandler.bind(this)
    );
    server.delete(
      '/transaction-types/:transactionId',
      this.deleteTransactionTypeHandler.bind(this)
    );
  }
}

export { BudgetHandlers };
