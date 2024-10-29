/* eslint-disable no-console */
import config from "config";
import { createUploadthing, type FileRouter } from "uploadthing/fastify";

import { verifyJWT } from "@/plugins/authenticate";
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
      // return { user_id: "me" };
      await verifyJWT(req); // Use the verifyJWT function to verify the JWT
      const user_id = req.user.user_id; // Extract the user_id from the verified JWT
      return { user_id };
    })
    .onUploadComplete((data) => {
      console.log("MY ID", data.metadata.user_id);
      const imageUrl = data.file.url;
      console.log("upload completed", imageUrl);
    }),
} satisfies FileRouter;

export type ProfileImageFileRouter = typeof uploadRouter;
