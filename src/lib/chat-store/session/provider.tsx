"use client";

import { usePathname } from "next/navigation";
import { createContext, useContext, useMemo } from "react";

const ChatSessionContext = createContext<{ chatId: string | null }>({
  chatId: null,
});

/**
 * Provider for the chat session context
 *
 * @param children - The children to render
 * @returns The chat session provider
 */
export function ChatSessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const chatId = useMemo(() => {
    if (pathname?.startsWith("/c/")) {
      return pathname.split("/c/")[1];
    }
    return null;
  }, [pathname]);

  return (
    <ChatSessionContext.Provider value={{ chatId }}>
      {children}
    </ChatSessionContext.Provider>
  );
}

/**
 * Hook to use the chat session context
 *
 * @returns The chat session context
 */
export const useChatSession = () => {
  const context = useContext(ChatSessionContext);

  if (!context) {
    throw new Error("useChatSession must be used within ChatSessionProvider");
  }

  return context;
};
