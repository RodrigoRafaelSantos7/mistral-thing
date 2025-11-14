import { createEnv } from "@t3-oss/env-nextjs";
import { vercel } from "@t3-oss/env-nextjs/presets-zod";
import { z } from "zod/v4";

export const env = createEnv({
  client: {
    NEXT_PUBLIC_CONVEX_URL: z.url(),
  },
  server: {},
  shared: {
    NODE_ENV: z.enum(["development", "production"]).default("development"),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_CONVEX_URL: process.env.NEXT_PUBLIC_CONVEX_URL,
    NODE_ENV: process.env.NODE_ENV,
  },
  extends: [vercel()],
});
