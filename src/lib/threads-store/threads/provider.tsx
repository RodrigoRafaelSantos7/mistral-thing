"use client";

import { type Preloaded, useMutation, usePreloadedQuery } from "convex/react";
import { createContext, useContext } from "react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import type { Message } from "@/lib/threads-store/messages/utils";
import type { Thread } from "@/lib/threads-store/threads/utils";

type ThreadsContextType = {
  threads: Thread[];
  createThread: (args: { slug: string }) => Promise<Id<"thread">>;
  createThreadAndSendMessage: (args: {
    content: string;
    slug: string;
    tempThreadId?: Id<"thread">;
  }) => Promise<string>;
  updateThread: (args: {
    id: Id<"thread">;
    title?: string;
    status?: "ready" | "streaming" | "submitted";
  }) => void;
  removeThread: (args: { id: Id<"thread"> }) => void;
  getThreadById: (id: Id<"thread">) => Thread | undefined;
};

const ThreadsContext = createContext<ThreadsContextType | null>(null);

export function ThreadsProvider({
  initialThreads,
  children,
}: {
  children: React.ReactNode;
  initialThreads: Preloaded<typeof api.threads.getThreadsForUser>;
}) {
  const threadsQueryResult = usePreloadedQuery(initialThreads);
  const threads = threadsQueryResult ?? [];

  const createThread = useMutation(api.threads.create).withOptimisticUpdate(
    (localStore, args) => {
      const currentThreads = localStore.getQuery(
        api.threads.getThreadsForUser,
        {}
      );
      if (currentThreads !== undefined && currentThreads !== null) {
        const now = Date.now();
        const tempThread: Thread = {
          _id: `temp-${now}` as Id<"thread">,
          _creationTime: now,
          userId: "",
          slug: args.slug,
          status: "streaming",
          updatedAt: now,
        };
        const updatedThreads = [tempThread, ...currentThreads];
        localStore.setQuery(api.threads.getThreadsForUser, {}, updatedThreads);
      }
    }
  );

  const baseCreateThreadAndSendMessage = useMutation(
    api.chat.createThreadAndSendMessage
  );

  const createThreadAndSendMessage = async (args: {
    content: string;
    slug: string;
    tempThreadId?: Id<"thread">;
  }): Promise<string> => {
    const slug = args.slug;
    const tempThreadId =
      args.tempThreadId ?? (`temp-thread-${Date.now()}` as Id<"thread">);

    const mutationWithOptimisticUpdate =
      baseCreateThreadAndSendMessage.withOptimisticUpdate(
        (localStore, mutationArgs) => {
          const now = Date.now();

          const tempThread: Thread = {
            _id: tempThreadId,
            _creationTime: now,
            userId: "",
            slug: mutationArgs.slug,
            title: "Processing...",
            status: "streaming",
            updatedAt: now,
          };

          // Update threads query (for sidebar)
          const currentThreads = localStore.getQuery(
            api.threads.getThreadsForUser,
            {}
          );
          if (currentThreads !== undefined && currentThreads !== null) {
            const updatedThreads = [tempThread, ...currentThreads];
            localStore.setQuery(
              api.threads.getThreadsForUser,
              {},
              updatedThreads
            );
          }

          // Update getThreadBySlug query (for ThreadSessionProvider - instant routing)
          localStore.setQuery(
            api.threads.getThreadBySlug,
            { slug: mutationArgs.slug },
            tempThread
          );

          // Update messages query
          const tempUserMessageId = `temp-user-${now}` as Id<"messages">;
          const userMessage: Message = {
            _id: tempUserMessageId,
            _creationTime: now,
            threadId: tempThreadId,
            role: "user",
            content: mutationArgs.content,
          };
          localStore.setQuery(
            api.messages.getMessagesForThread,
            { threadId: tempThreadId },
            [userMessage]
          );
        }
      );

    const result = await mutationWithOptimisticUpdate({
      content: args.content,
      slug,
    });
    return result.slug;
  };

  const updateThread = useMutation(api.threads.update).withOptimisticUpdate(
    (localStore, args) => {
      const currentThreads = localStore.getQuery(
        api.threads.getThreadsForUser,
        {}
      );
      if (currentThreads !== undefined && currentThreads !== null) {
        const updatedThreads = currentThreads.map((thread) =>
          thread._id === args.id
            ? {
                ...thread,
                ...(args.title !== undefined && { title: args.title }),
                updatedAt: Date.now(),
              }
            : thread
        );
        localStore.setQuery(api.threads.getThreadsForUser, {}, updatedThreads);
      }
    }
  );

  const removeThread = useMutation(api.threads.remove).withOptimisticUpdate(
    (localStore, args) => {
      const currentThreads = localStore.getQuery(
        api.threads.getThreadsForUser,
        {}
      );
      if (currentThreads !== undefined && currentThreads !== null) {
        const updatedThreads = currentThreads.filter(
          (thread) => thread._id !== args.id
        );
        localStore.setQuery(api.threads.getThreadsForUser, {}, updatedThreads);
      }
    }
  );

  const getThreadById = (id: Id<"thread">) =>
    threads.find((thread) => thread._id === id);

  return (
    <ThreadsContext.Provider
      value={{
        threads,
        createThread,
        createThreadAndSendMessage,
        updateThread,
        removeThread,
        getThreadById,
      }}
    >
      {children}
    </ThreadsContext.Provider>
  );
}

/**
 * Custom hook to access the threads context.
 *
 * @throws {Error} If the component is not wrapped in a ThreadsProvider
 * @returns The threads context
 */
export function useThreads() {
  const context = useContext(ThreadsContext);

  if (!context) {
    throw new Error("useThreads must be used within ThreadsProvider");
  }

  return context;
}
