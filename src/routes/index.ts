import type { FastifyInstance } from "fastify";

import { clerkPlugin } from "@clerk/fastify";
import config from "config";
import { createRouteHandler } from "uploadthing/fastify";

import { authRoutes } from "./auth-routes";
import { budgetRoutes } from "./budget-routes";
import { uploadRouter } from "./uploadthing";
import { userRoutes } from "./user-routes";

export async function routes(server: FastifyInstance) {
  const commonPrefix = `/api/${config.get("server.api.version")}`;
  server.register(clerkPlugin);
  await server.register(authRoutes, { prefix: `${commonPrefix}/auth` });
  await server.register(budgetRoutes, { prefix: `${commonPrefix}/budgets` });
  await server.register(userRoutes, { prefix: `${commonPrefix}/user` });
  await server
    .register(createRouteHandler, {
      router: uploadRouter,
      logLevel: "error",
    });
}
