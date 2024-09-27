import { FastifyInstance } from "fastify";

import {
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
    getBudgetCategoriesHandler,
    getBudgetCategoryItemHandler,
    getBudgetCategoryItemsHandler,
    updateBudgetCategoryItemHandler,
    deleteBudgetCategoryItemHandler,
    deleteAllBudgetCategoryItemsHandler
} from "../handlers/budget-handlers";

export default async function(server: FastifyInstance) {
    
    // Budgets
    server.post('/', createBudgetHandler)
    server.get('/', getBudgetsHandler)
    server.get('/:id', getBudgetHandler)
    server.put('/:id', updateBudgetHandler)
    server.delete('/:id', deleteBudgetHandler)

    // Budget Categories
    server.post('/categories', createBudgetCategoryHandler)
    server.get('/categories', getBudgetCategoriesHandler)
    server.get('/categories/:id', getBudgetCategoryHandler)
    server.put('/categories/:id', updateBudgetCategoryHandler)
    server.delete('/categories/:id', deleteBudgetCategoryHandler)

    // Budget Category Items
    server.post('/categories/:id/items', createBudgetCategoryItemHandler)
    server.get('/categories/:id/items', getBudgetCategoryItemsHandler)
    server.get('/categories/:id/items/:id', getBudgetCategoryItemHandler)
    server.put('/categories/:id/items/:id', updateBudgetCategoryItemHandler)
    server.delete('/categories/:id/items/:id', deleteBudgetCategoryItemHandler)
    server.delete('/categories/:id/items', deleteAllBudgetCategoryItemsHandler)
}