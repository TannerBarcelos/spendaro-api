import type { FastifyInstance, FastifyPluginCallback } from "fastify";

import { fastifyPlugin as fp } from "fastify-plugin";

import { client, db } from "@/db";

const postgresDbPlugin: FastifyPluginCallback = async (fastify: FastifyInstance) => {
  try {
    fastify.decorate<typeof db>("db", db);
    fastify.log.info("Connected to the database");
    fastify.addHook("onClose", async () => {
      await client.end();
    });
  }
  catch (error) {
    console.error("Error connecting to the database", error);
    process.exit(1);
  }
};

export default fp(postgresDbPlugin);
