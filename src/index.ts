import config from 'config'; // NODE_ENV this server is running in will resolve to the appropriate config file in the config folder
import fastify, { FastifyInstance, FastifyRequest } from 'fastify';
import { routes } from './routes';
import dotenv from 'dotenv';
import db from './db';
import cors from '@fastify/cors';
import { ALLOWED_METHODS } from './util/http';
import authenticate from './plugins/authenticate';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';

dotenv.config();

const server = fastify();
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
  server.register(swagger);
  server.register(swaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: false,
    },
    staticCSP: true
  });
  server.register(authenticate);
  server.register(cors, {
    origin: '*',
    methods: ALLOWED_METHODS,
  });
  server.register(db);
}
