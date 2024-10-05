//@ts-ignore
import scalarOpenApiUi from '@scalar/fastify-api-reference';
import config from 'config'; // NODE_ENV this server is running in will resolve to the appropriate config file in the config folder
import fastify, { FastifyError, FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { routes } from './routes';
import dotenv from 'dotenv';
import db from './db';
import cors from '@fastify/cors';
import { ALLOWED_METHODS, prepareResponse, STATUS_CODES } from './utils/http';
import authenticate from './plugins/authenticate';
import swagger from '@fastify/swagger';
import { scalarOpenApiUiConfig, swaggerConfig } from './open-api';
import { getReasonPhrase } from 'http-status-codes';
import { DrizzleError } from 'drizzle-orm';

dotenv.config();

const server = fastify({
  // Uses Pino for logging
  logger: {
    enabled: true,
    level: config.get('server.logging.level'),
  },
});

server.setErrorHandler(function (error: FastifyError, request: FastifyRequest, reply: FastifyReply) {
  request.log.error(error); // send to Sentry or similar service to monitor errors
  reply
    .status(error.statusCode || 500)
    .send(
      prepareResponse(
        null,
        error.statusCode || 500,
        getReasonPhrase(error.statusCode || 500),
        process.env.NODE_ENV === 'development' ? error.stack : error.message
      )
    );
});

server.setNotFoundHandler((request:FastifyRequest, reply:FastifyReply) => {
  reply
    .status(STATUS_CODES.NOT_FOUND)
    .send(
      prepareResponse(null, STATUS_CODES.NOT_FOUND, getReasonPhrase(STATUS_CODES.NOT_FOUND), `Resource ${request.url} not found`)
    );
});

registerServerPlugins(server);

server.get('/healthz', async (request: FastifyRequest) => {
  return { status: 'OK' };
});

const apiRoutePrefix = `${config.get('server.api.prefix')}/${config.get('server.api.version')}`;
server.register(routes, { prefix: apiRoutePrefix });

server.listen({ port: config.get('server.port') }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});

function registerServerPlugins(server: FastifyInstance) {
  server.register(swagger, swaggerConfig);
  server.register(scalarOpenApiUi, scalarOpenApiUiConfig);
  server.register(authenticate);
  server.register(cors, {
    origin: '*',
    methods: ALLOWED_METHODS,
  });
  server.register(db);
}
