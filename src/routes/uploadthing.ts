import config from "config";
import { createUploadthing, type FileRouter } from "uploadthing/fastify";

const uploadthing = createUploadthing();

export const uploadRouter: FileRouter = {
  profileImageUploader: uploadthing({
    image: {
      maxFileSize: config.get("server.upload-thing.max_file_size") ?? "4MB",
      maxFileCount: config.get("server.upload-thing.max_files") ?? 1,
    },
  })
    .middleware(({ req }) => {
      // confirm that the user is authenticated - check the jwt token
      req.server.addHook("onRequest", req.server.authenticate);
      //   error is thrown in the hook, so we can assume that the user is authenticated here if we get to this block
      return { user_id: req.user.user_id };
    })
    .onUploadComplete((data) => {
      // eslint-disable-next-line no-console
      console.log("upload completed", data);
    }),
} satisfies FileRouter;

export type ProfileImageFileRouter = typeof uploadRouter;
