import type { ReactNode } from "react";
import { ConvexClientProvider } from "@/components/providers/convex-client-provider";
import { DatabaseProvider } from "@/context/database";

const Providers = ({ children }: { children: ReactNode }) => (
  <ConvexClientProvider>
    <DatabaseProvider>{children}</DatabaseProvider>
  </ConvexClientProvider>
);

export default Providers;
