import type { FastifyInstance } from "fastify";

import config from "config";
import { createRouteHandler } from "uploadthing/fastify";

import { budgetRoutes } from "./budget-routes";
import { uploadRouter } from "./uploadthing";
import { userRoutes } from "./user-routes";

export async function v1(server: FastifyInstance) {
  await server.register(budgetRoutes, { prefix: "/budgets" });
  await server.register(userRoutes, { prefix: "/user" });
  await server
    .register(createRouteHandler, {
      router: uploadRouter,
      logLevel: "error",
    });
}
