import config from 'config' // NODE_ENV this server is running in will resolve to the appropriate config file in the config folder
import fastify from 'fastify';
import routes from './routes';

const server = fastify();

server.get('/healthz', async () => {
  return { status: 'OK' };
});

server.register(routes, { prefix: '/api/v1' });

server.listen({ port: config.get('server.port') }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
