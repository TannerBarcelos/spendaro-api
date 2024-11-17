import type { FastifyInstance } from "fastify";

import config from "config";
import { createRouteHandler } from "uploadthing/fastify";

import { budgetRoutes } from "./budget-routes";
import { uploadRouter } from "./uploadthing";
import { userRoutes } from "./user-routes";

export async function routes(server: FastifyInstance) {
  const commonPrefix = `/api/${config.get("server.api.version")}`;

  await server.register(budgetRoutes, { prefix: `${commonPrefix}/budgets` });
  await server.register(userRoutes, { prefix: `${commonPrefix}/user` });
  await server
    .register(createRouteHandler, {
      router: uploadRouter,
      logLevel: "error",
    });
}
