"use client";

import { useQuery } from "convex/react";
import { usePathname } from "next/navigation";
import { createContext, useContext, useMemo } from "react";
import { api } from "@/convex/_generated/api";
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

  const slug = useMemo(() => {
    if (pathname?.startsWith("/t/")) {
      return pathname.split("/t/")[1];
    }
    return null;
  }, [pathname]);

  // Look up thread by slug to get the threadId
  const thread = useQuery(
    api.threads.getThreadBySlug,
    slug ? { slug } : "skip"
  );

  const threadId = useMemo(() => thread?._id ?? null, [thread]);

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
