import { fetchQuery } from "convex/nextjs";
import {
  createRouteHandler,
  createUploadthing,
  type FileRouter,
} from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { api } from "@/convex/_generated/api";
import { getToken } from "@/lib/auth-server";
import { logger } from "@/lib/logger";

const f = createUploadthing();

export const router = {
  fileUploader: f({
    image: {
      maxFileSize: "8MB",
      maxFileCount: 5,
    },
    pdf: {
      maxFileSize: "32MB",
      maxFileCount: 5,
    },
    text: {
      maxFileSize: "8MB",
      maxFileCount: 5,
    },
  })
    .middleware(async () => {
      const token = await getToken();

      if (!token) {
        throw new UploadThingError("Unauthorized");
      }

      const session = await fetchQuery(api.users.getSession, {}, { token });

      if (!session) {
        throw new UploadThingError("Unauthorized");
      }

      return { session };
    })
    .onUploadComplete(({ metadata }) => {
      logger.info(`Upload complete for userId: ${metadata.session.user.id}`);

      return { uploadedBy: metadata.session.user.id };
    }),
} satisfies FileRouter;

export const { GET, POST } = createRouteHandler({ router });

export type UploadRouter = typeof router;
