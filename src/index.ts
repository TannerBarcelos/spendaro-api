/* eslint-disable no-console */
import type { FastifyRequest } from "fastify";

import config from "config";
import dotenv from "dotenv";
import fastify from "fastify";
import { getReasonPhrase, StatusCodes } from "http-status-codes";

import { routes } from "@/routes/index";

import { bootstrapServerPlugins } from "./bootstrap";

dotenv.config();

const server = fastify({
  logger: {
    enabled: true,
    level: config.get("server.logging.level"),
  },
});

(async function startServer() {
  await bootstrapServerPlugins(server);

  server.get("/healthz", async (_: FastifyRequest) => {
    return { status: getReasonPhrase(StatusCodes.OK) };
  });

  server.register(routes);
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
})();
