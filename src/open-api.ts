import { SwaggerOptions } from '@fastify/swagger';
import { FastifySwaggerUiOptions } from '@fastify/swagger-ui';

// Learn more here -> https://github.com/fastify/fastify-swagger
export const swaggerConfig: SwaggerOptions = {
  openapi: {
    openapi: '3.0.0',
    // metadata about the API
    info: {
      title: 'Spendaro REST API',
      version: '1.0.0',
      description:
        'A feature-rich REST API for managing your personal finances on the Spendaro platform',
    },
    // available servers to run the API methods on from the Swagger UI
    servers: [
      {
        url: 'http://localhost:8010',
        description: 'Local Development Server',
      },
    ],
    // represent the sections in the UI - these are assigned as tags to each API schema object
    tags: [
      {
        name: 'budget',
        description: 'View and manage budgets',
      },
      {
        name: 'auth',
        description: 'Authentication and Authorization',
      },
      {
        name: 'transactions',
        description:
          'Full CRUD operations for Transactions (add transaction, get transaction, update transaction, delete transaction)',
      },
      {
        name: 'categories',
        description: 'View and manage budget categories',
      },
      {
        name: 'items',
        description:
          'View and manage budget category items - the individual items that make up a budget category like Bills -> Rent, Bills -> Utilities, etc.',
      },
    ],
  },
};

export const swaggerUiConfig: FastifySwaggerUiOptions = {
  routePrefix: '/docs',
  uiConfig: {
    docExpansion: 'list',
    deepLinking: false,
  },
  staticCSP: true,
};
