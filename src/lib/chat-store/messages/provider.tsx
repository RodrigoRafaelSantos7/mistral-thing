"use client";

import type { UIMessage } from "ai";
import { useMutation, useQuery } from "convex/react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { useChatSession } from "@/lib/chat-store/session/provider";
import {
  type ConvexMessage,
  cacheMessages,
  clearCachedMessagesForChat,
  convexMessagesToUI,
  getCachedMessages,
  uiMessageToConvex,
} from "./api";

type MessageAISDK = UIMessage<{ createdAt: string }>;

type MessagesContextType = {
  messages: MessageAISDK[];
  isLoading: boolean;
  saveAllMessages: (messages: MessageAISDK[]) => Promise<void>;
  cacheAndAddMessage: (message: MessageAISDK) => void;
  resetMessages: () => void;
  deleteMessages: () => Promise<void>;
};

const MessagesContext = createContext<MessagesContextType | null>(null);

export function MessagesProvider({ children }: { children: React.ReactNode }) {
  const { chatId } = useChatSession();
  const [cachedMessages, setCachedMessages] = useState<MessageAISDK[]>([]);
  const [isLoadingCache, setIsLoadingCache] = useState(true);

  // Subscribe to Convex messages in real-time
  const convexMessagesData = useQuery(
    api.messages.list,
    chatId ? { chatId } : "skip"
  );

  // Convert Convex messages to UI format
  const convexMessages = useMemo(() => {
    if (!convexMessagesData) {
      return [];
    }
    return convexMessagesToUI(convexMessagesData as ConvexMessage[]);
  }, [convexMessagesData]);

  // Optimistic mutation for creating messages
  const createMessage = useMutation(api.messages.create).withOptimisticUpdate(
    (localStore, args) => {
      const current = localStore.getQuery(api.messages.list, {
        chatId: args.chatId,
      });
      if (current) {
        const tempMessage: ConvexMessage = {
          _id: `temp-${Date.now()}` as Id<"messages">,
          _creationTime: Date.now(),
          chatId: args.chatId,
          content: args.content,
          role: args.role,
          parts: args.parts,
          userId: args.userId,
          messageGroupId: args.messageGroupId,
          model: args.model,
        };
        localStore.setQuery(api.messages.list, { chatId: args.chatId }, [
          ...current,
          tempMessage,
        ]);
      }
    }
  );

  const createBatchMessages = useMutation(api.messages.createBatch);

  // Optimistic mutation for deleting messages
  const deleteMessagesMutation = useMutation(
    api.messages.deleteMessagesOfChat
  ).withOptimisticUpdate((localStore, args) => {
    const current = localStore.getQuery(api.messages.list, {
      chatId: args.chatId as string,
    });
    if (current) {
      // Clear all messages optimistically
      localStore.setQuery(
        api.messages.list,
        { chatId: args.chatId as string },
        []
      );
    }
  });

  // Load cached messages immediately on chatId change (for first-load experience)
  useEffect(() => {
    if (!chatId) {
      setCachedMessages([]);
      setIsLoadingCache(false);
      return;
    }

    const loadCache = async () => {
      setIsLoadingCache(true);
      try {
        const cached = await getCachedMessages(chatId);
        setCachedMessages(cached);
      } catch (error) {
        console.error("Failed to load cached messages:", error);
      } finally {
        setIsLoadingCache(false);
      }
    };

    loadCache();
  }, [chatId]);

  // Use Convex messages once loaded, fallback to cache for first-load
  const messages = useMemo(() => {
    if (!chatId) {
      return [];
    }
    // Once Convex data is available, use it (source of truth)
    // Otherwise, show cached messages for instant first-load
    return convexMessages.length > 0 ? convexMessages : cachedMessages;
  }, [convexMessages, cachedMessages, chatId]);

  // Update cache when Convex messages load (for next first-load)
  useEffect(() => {
    if (!chatId || convexMessages.length === 0) {
      return;
    }

    cacheMessages(chatId, convexMessages).catch((error: unknown) => {
      console.error("Failed to update cache:", error);
    });
  }, [chatId, convexMessages]);

  const isLoading =
    isLoadingCache || (chatId !== null && convexMessagesData === undefined);

  const cacheAndAddMessage = async (message: MessageAISDK) => {
    if (!chatId) {
      return;
    }

    try {
      // Normalize message with createdAt
      const createdAt =
        (message.metadata &&
          (message.metadata as { createdAt?: string }).createdAt) ||
        new Date().toISOString();
      const normalized: MessageAISDK = {
        ...message,
        metadata: {
          ...(message.metadata || {}),
          createdAt,
        },
      };

      const convexData = uiMessageToConvex(normalized, chatId);
      await createMessage(convexData);
    } catch (error) {
      console.error("Failed to save message:", error);
      toast.error("Failed to save message");
    }
  };

  const saveAllMessages = async (newMessages: MessageAISDK[]) => {
    if (!chatId) {
      return;
    }

    try {
      const convexData = newMessages.map((msg) =>
        uiMessageToConvex(msg, chatId)
      );
      await createBatchMessages({ messages: convexData });
    } catch (error) {
      console.error("Failed to save messages:", error);
      toast.error("Failed to save messages");
    }
  };

  const deleteMessages = async () => {
    if (!chatId) {
      return;
    }

    try {
      // Clear local cache immediately
      setCachedMessages([]);
      await clearCachedMessagesForChat(chatId);

      // Delete from Convex (with optimistic update)
      await deleteMessagesMutation({ chatId: chatId as Id<"chat"> });
    } catch (error) {
      console.error("Failed to delete messages:", error);
      toast.error("Failed to delete messages");
      // Restore cache on error
      try {
        const cached = await getCachedMessages(chatId);
        setCachedMessages(cached);
      } catch {
        console.error("Failed to restore cache:", error);
      }
    }
  };

  const resetMessages = () => {
    setCachedMessages([]);
  };

  return (
    <MessagesContext.Provider
      value={{
        messages,
        isLoading,
        saveAllMessages,
        cacheAndAddMessage,
        resetMessages,
        deleteMessages,
      }}
    >
      {children}
    </MessagesContext.Provider>
  );
}

/**
 * Hook to use the messages context
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
