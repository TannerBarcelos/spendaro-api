/* eslint-disable no-console */
import config from "config";
import { createUploadthing, type FileRouter } from "uploadthing/fastify";

import { ForbiddenError } from "@/utils/error";

const uploadthing = createUploadthing();

export const uploadRouter: FileRouter = {
  profileImageUploader: uploadthing({
    image: {
      maxFileSize: config.get("server.upload-thing.max_file_size") ?? "4MB",
      maxFileCount: config.get("server.upload-thing.max_files") ?? 1,
    },
  })
    .middleware(async ({ req }) => {
      // const token = await verifyJWT(req);
      return { user_id: 1 };
    })
    .onUploadError(({ error }) => {
      console.log(error);
    })
    .onUploadComplete((data) => {
      console.log("MY ID", data.metadata.user_id);
      const imageUrl = data.file.url;
      console.log("upload completed", imageUrl);
    }),
} satisfies FileRouter;

export type ProfileImageFileRouter = typeof uploadRouter;
