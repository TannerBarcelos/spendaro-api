import type { FastifyInstance, FastifyRequest } from "fastify";

import cors from "@fastify/cors";
import swagger from "@fastify/swagger";
import scalarOpenApiUi from "@scalar/fastify-api-reference";
import config from "config";
import dotenv from "dotenv";
import fastify from "fastify";

import db from "./db/index.js";
import { ErrorHandlers } from "./handlers/error-handlers.js";
import { scalarOpenApiUiConfig, swaggerConfig } from "./open-api.js";
import authenticate from "./plugins/authenticate.js";
import { routes } from "./routes/index.js";
import { ALLOWED_METHODS } from "./utils/http.js";

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
