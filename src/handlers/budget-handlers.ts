import { BudgetService } from '@/services/budget-service';
import { prepareResponse, STATUS_CODES } from '@/util/http';
import { FastifyRequest, FastifyReply, FastifyInstance } from 'fastify';

class BudgetHandlers {
  private budgetService: BudgetService;

  constructor(budgetService: BudgetService) {
    this.budgetService = budgetService;
  }

  async getBudgetsHandler(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = request.params.userId;
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

  async getBudgetByIdHandler(request: FastifyRequest, reply: FastifyReply) {
    try {
      const budgetId = request.params.budgetId;
      const budget = await this.budgetService.getBudgetById(budgetId);
      reply.send(
        prepareResponse(budget, STATUS_CODES.OK, 'Budget fetched successfully')
      );
    } catch (error) {
      reply.send(
        prepareResponse(error, STATUS_CODES.BAD_REQUEST, 'Bad Request')
      );
    }
  }

  async createBudgetHandler(request: FastifyRequest, reply: FastifyReply) {
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
        prepareResponse(error, STATUS_CODES.BAD_REQUEST, 'Bad Request')
      );
    }
  }

  async updateBudgetHandler(request: FastifyRequest, reply: FastifyReply) {
    try {
      const budget = request.body;
      const updatedBudget = await this.budgetService.updateBudget(budget);
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

  async deleteBudgetHandler(request: FastifyRequest, reply: FastifyReply) {
    try {
      const budgetId = request.params.budgetId;
      const deletedBudget = await this.budgetService.deleteBudget(budgetId);
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

  // Budget Categories
  async getBudgetCategoriesHandler(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    try {
      const budgetId = request.params.budgetId;
      const categories = await this.budgetService.getBudgetCategories(budgetId);
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
    request: FastifyRequest,
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
    request: FastifyRequest,
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
    request: FastifyRequest,
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
    request: FastifyRequest,
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

  // Budget Category Items
  async getBudgetCategoryItemsHandler(
    request: FastifyRequest,
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
    request: FastifyRequest,
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
    request: FastifyRequest,
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
    request: FastifyRequest,
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
    request: FastifyRequest,
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

  // Transactions
  async getTransactionsHandler(request: FastifyRequest, reply: FastifyReply) {
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
    request: FastifyRequest,
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

  async createTransactionHandler(request: FastifyRequest, reply: FastifyReply) {
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

  async updateTransactionHandler(request: FastifyRequest, reply: FastifyReply) {
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

  async deleteTransactionHandler(request: FastifyRequest, reply: FastifyReply) {
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

  // Transaction Types

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
    request: FastifyRequest,
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
    request: FastifyRequest,
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
    request: FastifyRequest,
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
    request: FastifyRequest,
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
    server.get('/budgets', this.getBudgetsHandler.bind(this));
    server.get('/budgets/:budgetId', this.getBudgetByIdHandler.bind(this));
    server.post('/budgets', this.createBudgetHandler.bind(this));
    server.put('/budgets', this.updateBudgetHandler.bind(this));
    server.delete('/budgets/:budgetId', this.deleteBudgetHandler.bind(this));
    server.get(
      '/budgets/:budgetId/categories',
      this.getBudgetCategoriesHandler.bind(this)
    );
    server.get(
      '/budgets/categories/:categoryId',
      this.getBudgetCategoryByIdHandler.bind(this)
    );
    server.post(
      '/budgets/categories',
      this.createBudgetCategoryHandler.bind(this)
    );
    server.put(
      '/budgets/categories',
      this.updateBudgetCategoryHandler.bind(this)
    );
    server.delete(
      '/budgets/categories/:categoryId',
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
