import { Analytics } from "@vercel/analytics/next";
import type { ReactNode } from "react";
import { ConvexClientProvider } from "@/components/convex-client-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

const Providers = ({ children }: { children: ReactNode }) => (
  <ConvexClientProvider>
    <ThemeProvider>
      {children}
      <Analytics />
      <Toaster position="top-center" />
    </ThemeProvider>
  </ConvexClientProvider>
);

export { Providers };
