import config from "config";
import { eq } from "drizzle-orm";
import { createUploadthing, type FileRouter } from "uploadthing/fastify";

import { db } from "@/db";
import * as schema from "@/db/schema";

const uploadthing = createUploadthing();

export const uploadRouter: FileRouter = {
  profileImageUploader: uploadthing({
    image: {
      maxFileSize: config.get("server.upload-thing.max_file_size") ?? "4MB",
      maxFileCount: config.get("server.upload-thing.max_files") ?? 1,
    },
  })
    .middleware(async ({ req, res }) => {
      await req.server.authenticate(req, res); // this will fail internally if the user is not authenticated, and throw a ForbiddenError
      return { user_id: req.user.id };
    })
    .onUploadError(({ error }) => {
      throw error;
    })
    .onUploadComplete(async (data) => {
      const user_id = data.metadata.user_id;
      await db.update(schema.users).set({ profileImage: data.file.url }).where(eq(schema.users.user_id, user_id));
      return { message: "Profile image uploaded successfully" };
    }),
} satisfies FileRouter;

export type ProfileImageFileRouter = typeof uploadRouter;
