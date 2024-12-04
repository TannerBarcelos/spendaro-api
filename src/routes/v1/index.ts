import type { FastifyInstance } from "fastify";

import { getAuth } from "@clerk/fastify";

import { ForbiddenError } from "@/utils/error";
import { clerkClient } from "@/utils/http";

import { budgetRoutes } from "./budget-routes";
import { userRoutes } from "./user-routes";

export async function v1(server: FastifyInstance) {
  server.addHook("preHandler", async (request) => {
    const { userId } = getAuth(request);
    if (!userId) {
      throw new ForbiddenError("Access denied. Authentication required.");
    }
    request.user = await clerkClient.users.getUser(userId);
  });
  await server.register(budgetRoutes, { prefix: "/budgets" });
  await server.register(userRoutes, { prefix: "/user" });
}
