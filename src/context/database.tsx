"use client";

import type { ConvexReactClient } from "convex/react";
import { useConvex } from "convex/react";
import { createContext, useMemo } from "react";
import { Loading } from "@/components/ui/loading";
import { useAnonymousConvexAuth } from "@/hooks/use-anonymous-convex-auth";

export const DatabaseContext = createContext<ConvexReactClient | undefined>(
  undefined
);

export function DatabaseProvider({ children }: { children: React.ReactNode }) {
  const convexClient = useConvex();
  const isReady = useMemo(() => convexClient !== undefined, [convexClient]);

  useAnonymousConvexAuth();

  if (!isReady) {
    return <Loading />;
  }

  return (
    <DatabaseContext.Provider value={convexClient}>
      {children}
    </DatabaseContext.Provider>
  );
}
