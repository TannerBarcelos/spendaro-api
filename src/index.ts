/* eslint-disable no-console */
import type { FastifyInstance, FastifyRequest } from "fastify";

import cookie from "@fastify/cookie";
import cors from "@fastify/cors";
import swagger from "@fastify/swagger";
import scalar from "@scalar/fastify-api-reference";
import config from "config";
import fastify from "fastify";
import { fastifyBcrypt } from "fastify-bcrypt";
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import { getReasonPhrase, StatusCodes } from "http-status-codes";

import db from "@/db/index";
import { ErrorHandlers } from "@/handlers/error/error-handlers";
import { swaggerConfig, swaggerScalarConfig } from "@/open-api";
import authenticate from "@/plugins/authenticate";
import { routes } from "@/routes/index";
import { cookieConfig, corsConfig } from "@/utils/http";

import { bcryptSaltConfig } from "./utils/jwt";

const server = fastify({
  logger: {
    enabled: true,
    level: config.get("server.logging.level"),
  },
});

server.setValidatorCompiler(validatorCompiler);
server.setSerializerCompiler(serializerCompiler);

server.setErrorHandler(ErrorHandlers.handleError);
server.setNotFoundHandler(ErrorHandlers.handleNotFoundError);

registerServerPlugins(server);

server.get("/healthz", async (_: FastifyRequest) => {
  return { status: getReasonPhrase(StatusCodes.OK) };
});

server.register(routes, { prefix: `/api/${config.get("server.api.version")}` });

server.listen({ port: config.get("server.port") }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});

function registerServerPlugins(server: FastifyInstance) {
  server.register(swagger, swaggerConfig);
  server.register(scalar, swaggerScalarConfig);
  server.register(cookie, cookieConfig);
  server.register(fastifyBcrypt, bcryptSaltConfig);
  server.register(authenticate);
  server.register(cors, corsConfig);
  server.register(db);
}
