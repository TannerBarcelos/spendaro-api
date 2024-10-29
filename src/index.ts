/* eslint-disable no-console */
import type { FastifyRequest } from "fastify";

import config from "config";
import fastify from "fastify";
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import { getReasonPhrase, StatusCodes } from "http-status-codes";

import { ErrorHandlers } from "@/handlers/error/error-handlers";
import { routes } from "@/routes/index";

import { bootstrapServerPlugins } from "./bootstrap";

const server = fastify({
  logger: {
    enabled: true,
    level: config.get("server.logging.level"),
  },
});

async function startServer() {
  await bootstrapServerPlugins(server);

  server.setValidatorCompiler(validatorCompiler);
  server.setSerializerCompiler(serializerCompiler);

  server.setErrorHandler(ErrorHandlers.handleError);
  server.setNotFoundHandler({ preHandler: server.rateLimit() }, ErrorHandlers.handleNotFoundError);

  server.get("/healthz", async (_: FastifyRequest) => {
    return { status: getReasonPhrase(StatusCodes.OK) };
  });

  server.register(routes, { prefix: `/api/${config.get("server.api.version")}` });

  await server.ready();

  try {
    server.listen({ port: config.get("server.port") }, (err, addr) => {
      if (err)
        throw err;
      console.log(`Server listening at ${addr}`);
    });
  }
  catch (err) {
    console.error(err);
    process.exit(1);
  }
}

startServer();
