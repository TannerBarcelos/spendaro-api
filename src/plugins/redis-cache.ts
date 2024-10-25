import type { FastifyInstance, FastifyPluginCallback } from "fastify";
import type { RedisOptions } from "ioredis";

import config from "config";
import fp from "fastify-plugin";
import Redis from "ioredis";

const redisConnector: FastifyPluginCallback = async (fastify: FastifyInstance) => {
  try {
    const cacheConfig: RedisOptions = {
      connectionName: config.get("server.cache.name"),
      host: config.get("server.cache.host"),
      port: config.get("server.cache.port"),
      connectTimeout: config.get("server.cache.connection_timeout"),
      maxRetriesPerRequest: config.get("server.cache.max_retries"),
    };

    const cache = new Redis(cacheConfig);

    fastify.decorate<typeof cache>("cache", cache);

    console.log("Connected to the redis store");

    fastify.addHook("onClose", async () => {
      await cache.quit();
    });
  }
  catch (error) {
    console.error("Error connecting to the redis cache", error);
    process.exit(1);
  }
};

export default fp(redisConnector);
