import { useConvexAuth } from "convex/react";
import { useEffect, useRef } from "react";
import { authClient } from "@/lib/auth-client";
import { logger } from "@/lib/logger";

const log = logger.child({ module: "useAnonymousConvexAuth" });

export function useAnonymousConvexAuth(onReady?: () => void) {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const bootstrapped = useRef(false);

  useEffect(() => {
    if (bootstrapped.current || isLoading) {
      return;
    }

    const ensureAuth = async () => {
      try {
        if (!isAuthenticated) {
          await authClient.signOut();
          await authClient.signIn.anonymous();
        }
        bootstrapped.current = true;
        if (onReady) {
          onReady();
        }
      } catch (error) {
        log.error(error);
      }
    };

    ensureAuth();
  }, [isAuthenticated, isLoading, onReady]);
}
