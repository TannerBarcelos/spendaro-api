/* eslint-disable no-console */
import type { FastifyRequest } from "fastify";

import config from "config";
import "dotenv/config";
import fastify from "fastify";
import { getReasonPhrase, StatusCodes } from "http-status-codes";

import { registerPlugins } from "./plugins";
import { routes } from "./routes";
import { webhooks } from "./webhooks";

const server = fastify({
  logger: {
    enabled: true,
    level: config.get("server.logging.level"),
  },
});

(async function startServer() {
  await registerPlugins(server);

  server.get("/healthz", async (_: FastifyRequest) => {
    return { status: getReasonPhrase(StatusCodes.OK) };
  });

  server.register(webhooks);
  server.register(routes);

  await server.ready();

  try {
    server.listen({ port: config.get("server.port"), host: "0.0.0.0" }, (err, addr) => {
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
