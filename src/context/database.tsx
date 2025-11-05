"use client";

import type { ConvexReactClient } from "convex/react";
import { useConvex, useConvexAuth, useMutation } from "convex/react";
import { createContext, useEffect } from "react";
import { Spinner } from "@/components/ui/spinner";
import { api } from "@/convex/_generated/api";
import { authClient } from "@/lib/auth-client";
import { logger } from "@/lib/logger";

export const DatabaseContext = createContext<ConvexReactClient | undefined>(
  undefined
);

const log = logger.child({ module: "DatabaseProvider" });

export function DatabaseProvider({ children }: { children: React.ReactNode }) {
  const convexClient = useConvex();
  const { isAuthenticated, isLoading } = useConvexAuth();
  const createSettings = useMutation(api.settings.create);

  useEffect(() => {
    const handleSignIn = async () => {
      if (!(isLoading || isAuthenticated)) {
        try {
          await authClient.signOut();
          await authClient.signIn.anonymous();
          createSettings().catch((error) => log.error(error));
        } catch (error) {
          log.error(error);
        }
      }
    };
    handleSignIn();
  }, [isAuthenticated, isLoading, createSettings]);

  if (isLoading || !isAuthenticated || !convexClient) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <Spinner />
      </div>
    );
  }

  return (
    <DatabaseContext.Provider value={convexClient}>
      {children}
    </DatabaseContext.Provider>
  );
}
