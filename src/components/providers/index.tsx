import type { ReactNode } from "react";
import { ConvexClientProvider } from "@/components/providers/convex-client-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";

const Providers = ({ children }: { children: ReactNode }) => (
  <ConvexClientProvider>
    <ThemeProvider>
      {children}
      <Toaster position="top-center" />
    </ThemeProvider>
  </ConvexClientProvider>
);

export default Providers;
