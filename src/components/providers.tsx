import { Analytics } from "@vercel/analytics/next";
import type { ReactNode } from "react";
import { ConvexClientProvider } from "@/components/convex-client-provider";

const Providers = ({ children }: { children: ReactNode }) => (
  <ConvexClientProvider>
    {children}
    <Analytics />
  </ConvexClientProvider>
);

export { Providers };
