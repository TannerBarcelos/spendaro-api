/* eslint-disable no-console */
import type { FastifyInstance } from "fastify";

import { createRouteHandler, createUploadthing, type FileRouter } from "uploadthing/fastify";

import { UserHandlers } from "@/handlers/user/user-handlers";
import { UserRepository } from "@/repositories/user-repository";
import { UserService } from "@/services/user-service";

export async function userRoutes(server: FastifyInstance) {
  server.addHook("onRequest", server.authenticate);
  const userRepo = new UserRepository(server.db);
  const userService = new UserService(userRepo);
  const userHandlers = new UserHandlers(userService);
  userHandlers.registerHandlers(server);

  const f = createUploadthing();
  const uploadRouter: FileRouter = {
    imageUploader: f({
      image: {
        maxFileSize: "4MB",
        maxFileCount: 4,
      },
    }).onUploadComplete((data) => {
      // save the fileurl to the user's profile
      console.log(data.file.url);
    }),
  } satisfies FileRouter;

  // Register the upload router for UploadThing. This will handle the file uploads
  server
    .register(createRouteHandler, {
      router: uploadRouter,
      config: {
        callbackUrl: "/api/v1/user/upload-profile-image",
      },
    });
}
