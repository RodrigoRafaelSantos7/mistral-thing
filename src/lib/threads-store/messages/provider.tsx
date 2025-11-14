"use client";

import { useQuery } from "convex/react";
import { createContext, useContext } from "react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { useThreadSession } from "@/lib/threads-store/session/provider";
import type { Message } from "./utils";

type MessagesContextType = {
  messages: Message[];
};

const MessagesContext = createContext<MessagesContextType | null>(null);

export function MessagesProvider({ children }: { children: React.ReactNode }) {
  const { threadId } = useThreadSession();
  const messages = useQuery(
    api.messages.getMessagesForThread,
    threadId ? { threadId: threadId as Id<"thread"> } : "skip"
  );

  return (
    <MessagesContext.Provider value={{ messages: messages ?? [] }}>
      {children}
    </MessagesContext.Provider>
  );
}

/**
 * Custom hook to access the messages context
 *
 * @returns The messages context
 */
export function useMessages() {
  const context = useContext(MessagesContext);

  if (!context) {
    throw new Error("useMessages must be used within MessagesProvider");
  }

  return context;
}
