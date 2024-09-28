import config from 'config' // NODE_ENV this server is running in will resolve to the appropriate config file in the config folder
import fastify from 'fastify';
import routes from './routes';
import dotenv from 'dotenv';
import db from './db'


dotenv.config();

const server = fastify();

server.get('/healthz', async () => {
  return { status: 'OK' };
});

// Register the database plugin, which uses Drizzle to connect to the database on Supabase
server.register(db);

server.register(routes, { prefix: '/api/v1' });

server.listen({ port: config.get('server.port') }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
