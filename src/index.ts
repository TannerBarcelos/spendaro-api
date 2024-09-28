import config from 'config' // NODE_ENV this server is running in will resolve to the appropriate config file in the config folder
import fastify, { FastifyRequest } from 'fastify';
import routes from './routes';
import dotenv from 'dotenv';
import db from './db'
import cors from '@fastify/cors'
import { ALLOWED_METHODS } from "./util/http";

dotenv.config();

const server = fastify();

server.register(cors, {
  origin: '*',
  methods: ALLOWED_METHODS,
})

server.register(db);

server.get('/healthz', async (request:FastifyRequest) => {
  return { status: 'OK' + request.user };
});

server.register(routes, { prefix: '/api/v1' });

server.listen({ port: config.get('server.port') }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
