import type { FastifyInstance, FastifyRequest } from "fastify";

import cors from "@fastify/cors"; // NODE_ENV this server is running in will resolve to the appropriate config file in the config folder
import swagger from "@fastify/swagger";
// @ts-expect-error @scalar/fastify-api-reference does not have types
import scalarOpenApiUi from "@scalar/fastify-api-reference";
import config from "config";
import dotenv from "dotenv";
import fastify from "fastify";

import db from "./db";
import { ErrorHandlers } from "./handlers/error-handlers";
import { scalarOpenApiUiConfig, swaggerConfig } from "./open-api";
import authenticate from "./plugins/authenticate";
import { routes } from "./routes";
import { ALLOWED_METHODS } from "./utils/http";

dotenv.config();

const server = fastify({
  // Uses Pino for logging
  logger: {
    enabled: true,
    level: config.get("server.logging.level"),
  },
});

server.setErrorHandler(ErrorHandlers.handleError);
server.setNotFoundHandler(ErrorHandlers.handleNotFoundError);

registerServerPlugins(server);

server.get("/healthz", async (_: FastifyRequest) => {
  return { status: "OK" };
});

const apiRoutePrefix = `${config.get("server.api.prefix")}/${config.get("server.api.version")}`;
server.register(routes, { prefix: apiRoutePrefix });

server.listen({ port: config.get("server.port") }, (err, address) => {
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
    origin: "*",
    methods: ALLOWED_METHODS,
  });
  server.register(db);
}
