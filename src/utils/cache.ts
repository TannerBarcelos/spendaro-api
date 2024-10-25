import config from "config";
import { Redis, type RedisOptions } from "ioredis";

export const cacheConfig: RedisOptions = {
  connectionName: config.get("server.cache.name"),
  host: config.get("server.cache.host"),
  port: config.get("server.cache.port"),
  connectTimeout: config.get("server.cache.connection_timeout"),
  maxRetriesPerRequest: config.get("server.cache.max_retries"),
};

export const cache = new Redis(cacheConfig);
