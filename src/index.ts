import type { FastifyInstance, FastifyRequest } from "fastify";

import cors from "@fastify/cors";
import swagger from "@fastify/swagger";
import scalar from "@scalar/fastify-api-reference";
import config from "config";
import fastify from "fastify";
import { fastifyBcrypt } from "fastify-bcrypt";

import db from "./db/index.js";
import { ErrorHandlers } from "./handlers/error-handlers.js";
import { swaggerConfig } from "./open-api.js";
import authenticate from "./plugins/authenticate.js";
import { routes } from "./routes/index.js";
import { ALLOWED_METHODS } from "./utils/http.js";

const server = fastify({
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
  server.register(scalar, {
    routePrefix: "/docs",
    configuration: {
      theme: "purple",
      defaultHttpClient: {
        targetKey: "javascript",
        clientKey: "fetch",
      },
      metaData: {
        title: "Spendaro API Docs",
        description: "API documentation for the Spendaro API",
        ogDescription: "API documentation for the Spendaro API",
        ogTitle: "Spendaro API Docs",
      },
      defaultOpenAllTags: true,
    },
  });
  server.register(fastifyBcrypt, {
    saltWorkFactor: config.get("security.jwt.salt_rounds"),
  });
  server.register(authenticate);
  server.register(cors, {
    origin: "*",
    methods: ALLOWED_METHODS,
  });
  server.register(db);
}
