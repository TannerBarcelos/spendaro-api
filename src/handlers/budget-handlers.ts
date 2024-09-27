import { FastifyReply, FastifyRequest } from "fastify";

function createBudgetHandler(request: FastifyRequest, reply: FastifyReply) {
    reply.send('createBudgetHandler');
}

function getBudgetHandler(request: FastifyRequest, reply: FastifyReply) {
    reply.send('getBudgetHandler');
}

function getBudgetsHandler(request: FastifyRequest, reply: FastifyReply) {
    reply.send('getBudgetsHandler');
}

function updateBudgetHandler(request: FastifyRequest, reply: FastifyReply) {
    reply.send('updateBudgetHandler');
}

function deleteBudgetHandler(request: FastifyRequest, reply: FastifyReply) {
    reply.send('deleteBudgetHandler');
}

function createBudgetCategoryHandler(request: FastifyRequest, reply: FastifyReply) {
    reply.send('createBudgetCategoryHandler');
}

function getBudgetCategoryHandler(request: FastifyRequest, reply: FastifyReply) {
    reply.send('getBudgetCategoryHandler');
}

function getBudgetCategoriesHandler(request: FastifyRequest, reply: FastifyReply) {
    reply.send('getBudgetCategoriesHandler');
}

function updateBudgetCategoryHandler(request: FastifyRequest, reply: FastifyReply) {
    reply.send('updateBudgetCategoryHandler');
}

function deleteBudgetCategoryHandler(request: FastifyRequest, reply: FastifyReply) {
    reply.send('deleteBudgetCategoryHandler');
}

function createBudgetCategoryItemHandler(request: FastifyRequest, reply: FastifyReply) {
    reply.send('createBudgetCategoryItemHandler');
}

function getBudgetCategoryItemHandler(request: FastifyRequest, reply: FastifyReply) {
    reply.send('getBudgetCategoryItemHandler');
}

function getBudgetCategoryItemsHandler(request: FastifyRequest, reply: FastifyReply) {
    reply.send('getBudgetCategoryItemsHandler');
}

function updateBudgetCategoryItemHandler(request: FastifyRequest, reply: FastifyReply) {
    reply.send('updateBudgetCategoryItemHandler');
}

function deleteBudgetCategoryItemHandler(request: FastifyRequest, reply: FastifyReply) {
    reply.send('deleteBudgetCategoryItemHandler');
}

function deleteAllBudgetCategoryItemsHandler(request: FastifyRequest, reply: FastifyReply) {
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
    deleteAllBudgetCategoryItemsHandler
};