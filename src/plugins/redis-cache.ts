import type { FastifyInstance, FastifyPluginCallback } from "fastify";
import type { RedisOptions } from "ioredis";

import config from "config";
import fp from "fastify-plugin";
import Redis from "ioredis";

import { env } from "@/env";

const redisConnector: FastifyPluginCallback = async (fastify: FastifyInstance) => {
  try {
    const cacheConfig: RedisOptions = {
      connectionName: env.REDIS_DB,
      host: env.REDIS_HOST,
      port: env.REDIS_PORT,
      password: env.REDIS_PASSWORD,
      connectTimeout: config.get("server.cache.connection_timeout"),
      maxRetriesPerRequest: config.get("server.cache.max_retries"),
    };

    const cache = new Redis(cacheConfig);

    fastify.decorate<typeof cache>("cache", cache);

    fastify.log.info("Connected to the redis store");

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
