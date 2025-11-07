"use client";

import type { ConvexReactClient } from "convex/react";
import { useConvex } from "convex/react";
import { createContext, useCallback, useMemo } from "react";
import { Loading } from "@/components/ui/loading";
import { useAnonymousConvexAuth } from "@/hooks/use-anonymous-convex-auth";
import { useSettings } from "@/hooks/use-database";
import { logger } from "@/lib/logger";

export const DatabaseContext = createContext<ConvexReactClient | undefined>(
  undefined
);

const log = logger.child({ module: "DatabaseProvider" });

export function DatabaseProvider({ children }: { children: React.ReactNode }) {
  const convexClient = useConvex();
  const { createSettings } = useSettings();
  const isReady = useMemo(() => convexClient !== undefined, [convexClient]);

  useAnonymousConvexAuth(
    useCallback(() => {
      log.info("Anonymous Convex Auth ready");
      createSettings();
    }, [createSettings])
  );

  if (!isReady) {
    return <Loading />;
  }

  return (
    <DatabaseContext.Provider value={convexClient}>
      {children}
    </DatabaseContext.Provider>
  );
}
