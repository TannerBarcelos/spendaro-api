import { FastifyReply, FastifyRequest } from 'fastify';

async function createBudgetHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  reply.send('createBudgetHandler');
}

async function getBudgetHandler(request: FastifyRequest, reply: FastifyReply) {
  reply.send('getBudgetHandler');
}

async function getBudgetsHandler(request: FastifyRequest, reply: FastifyReply) {
  reply.send('getBudgetsHandler');
}

async function updateBudgetHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  reply.send('updateBudgetHandler');
}

async function deleteBudgetHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  reply.send('deleteBudgetHandler');
}

async function createBudgetCategoryHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  reply.send('createBudgetCategoryHandler');
}

async function getBudgetCategoryHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  reply.send('getBudgetCategoryHandler');
}

async function getBudgetCategoriesHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  reply.send('getBudgetCategoriesHandler');
}

async function updateBudgetCategoryHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  reply.send('updateBudgetCategoryHandler');
}

async function deleteBudgetCategoryHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  reply.send('deleteBudgetCategoryHandler');
}

async function createBudgetCategoryItemHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  reply.send('createBudgetCategoryItemHandler');
}

async function getBudgetCategoryItemHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  reply.send('getBudgetCategoryItemHandler');
}

async function getBudgetCategoryItemsHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  reply.send('getBudgetCategoryItemsHandler');
}

async function updateBudgetCategoryItemHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  reply.send('updateBudgetCategoryItemHandler');
}

async function deleteBudgetCategoryItemHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  reply.send('deleteBudgetCategoryItemHandler');
}

async function deleteAllBudgetCategoryItemsHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  reply.send('deleteAllBudgetCategoryItemsHandler');
}

export {
  createBudgetHandler,
  getBudgetHandler,
  getBudgetsHandler,
  updateBudgetHandler,
  deleteBudgetHandler,
  createBudgetCategoryHandler,
  getBudgetCategoryHandler,
  updateBudgetCategoryHandler,
  deleteBudgetCategoryHandler,
  createBudgetCategoryItemHandler,
  getBudgetCategoryItemHandler,
  getBudgetCategoriesHandler,
  getBudgetCategoryItemsHandler,
  updateBudgetCategoryItemHandler,
  deleteBudgetCategoryItemHandler,
  deleteAllBudgetCategoryItemsHandler,
};
