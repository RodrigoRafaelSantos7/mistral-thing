import type { ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";
import { ConvexClientProvider } from "@/providers/convex-client-provider";
import { DatabaseProvider } from "@/providers/database-provider";

const Providers = async ({ children }: { children: ReactNode }) => (
  <ConvexClientProvider>
    <DatabaseProvider>
      {children}
      <Toaster position="top-center" />
    </DatabaseProvider>
  </ConvexClientProvider>
);

export default Providers;
