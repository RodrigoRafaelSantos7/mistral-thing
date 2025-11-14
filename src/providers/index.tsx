import type { ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";
import { ConvexClientProvider } from "@/providers/convex-client-provider";
import { DatabaseProvider } from "@/providers/database-provider";
import { ThemeProvider } from "@/providers/theme-provider";

const Providers = async ({ children }: { children: ReactNode }) => (
  <ConvexClientProvider>
    <DatabaseProvider>
      <ThemeProvider>{children}</ThemeProvider>
      <Toaster position="top-center" />
    </DatabaseProvider>
  </ConvexClientProvider>
);

export default Providers;
