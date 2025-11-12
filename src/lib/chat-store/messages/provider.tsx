import { useQuery } from "convex/react";
import { createContext, useContext } from "react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { useChatSession } from "@/lib/chat-store/session/provider";
import type { Message } from "./utils";

type MessagesContextType = {
  messages: Message[];
};

const MessagesContext = createContext<MessagesContextType | null>(null);

export function MessagesProvider({ children }: { children: React.ReactNode }) {
  const { chatId } = useChatSession();
  const messages = useQuery(api.messages.getChatMessages, {
    chatId: chatId as Id<"chat">,
  });

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
