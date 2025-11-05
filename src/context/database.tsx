"use client";

import type { ConvexReactClient } from "convex/react";
import { useConvex, useConvexAuth } from "convex/react";
import { createContext, useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";

export const DatabaseContext = createContext<ConvexReactClient | undefined>(
  undefined
);

export function DatabaseProvider({ children }: { children: React.ReactNode }) {
  const convexClient = useConvex();
  const { isAuthenticated, isLoading } = useConvexAuth();
  const [signingIn, setSigningIn] = useState(false);

  useEffect(() => {
    const handleSignIn = async () => {
      if (!(isLoading || isAuthenticated || signingIn)) {
        setSigningIn(true);
        try {
          await authClient.signOut();
          await authClient.signIn.anonymous();
        } catch {
          setSigningIn(false);
        }
      }
    };
    handleSignIn();
  }, [isAuthenticated, isLoading, signingIn]);

  useEffect(() => {
    if (isAuthenticated && signingIn) {
      setSigningIn(false);
    }
  }, [isAuthenticated, signingIn]);

  if (isLoading || signingIn || !isAuthenticated || !convexClient) {
    return null;
  }

  return (
    <DatabaseContext.Provider value={convexClient}>
      {children}
    </DatabaseContext.Provider>
  );
}
