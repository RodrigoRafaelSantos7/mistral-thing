import { createEnv } from "@t3-oss/env-nextjs";
import { vercel } from "@t3-oss/env-nextjs/presets-zod";
import { z } from "zod/v4";

export const env = createEnv({
  client: { NEXT_PUBLIC_CONVEX_URL: z.string() },
  server: {
    UPLOADTHING_TOKEN: z.string().min(1),
  },
  shared: {
    NODE_ENV: z.enum(["development", "production"]).default("development"),
  },
  experimental__runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_CONVEX_URL: process.env.NEXT_PUBLIC_CONVEX_URL,
  },
  extends: [vercel()],
});
