"use client";

import { usePathname } from "next/navigation";
import { createContext, useContext, useMemo } from "react";
import type { Id } from "@/convex/_generated/dataModel";

const ThreadSessionContext = createContext<{ threadId: Id<"thread"> | null }>({
  threadId: null,
});

/**
 * Provider for the chat session context
 *
 * @param children - The children to render
 * @returns The chat session provider
 */
export function ThreadSessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const threadId = useMemo(() => {
    if (pathname?.startsWith("/t/")) {
      return pathname.split("/t/")[1] as Id<"thread">;
    }
    return null;
  }, [pathname]);

  return (
    <ThreadSessionContext.Provider value={{ threadId }}>
      {children}
    </ThreadSessionContext.Provider>
  );
}

/**
 * Hook to use the thread session context
 *
 * @returns The thread session context
 */
export const useThreadSession = () => {
  const context = useContext(ThreadSessionContext);

  if (!context) {
    throw new Error(
      "useThreadSession must be used within ThreadSessionProvider"
    );
  }

  return context;
};
