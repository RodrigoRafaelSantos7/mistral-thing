"use client";

import { createContext, type ReactNode, useContext, useState } from "react";
import type { Id } from "@/convex/_generated/dataModel";

type Attachment = {
  type: "file";
  url: string;
  filename: string;
  mediaType?: string;
};

type ThreadContextValue = {
  editingMessageId: Id<"message"> | null;
  setEditingMessageId: (id: Id<"message"> | null) => void;
  input: string;
  setInput: (input: string) => void;
  attachments: Attachment[];
  setAttachments: (attachments: Attachment[]) => void;
};

const ThreadContext = createContext<ThreadContextValue | null>(null);

export function ThreadProvider({ children }: { children: ReactNode }) {
  const [editingMessageId, setEditingMessageId] =
    useState<Id<"message"> | null>(null);
  const [input, setInput] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);

  return (
    <ThreadContext.Provider
      value={{
        editingMessageId,
        setEditingMessageId,
        input,
        setInput,
        attachments,
        setAttachments,
      }}
    >
      {children}
    </ThreadContext.Provider>
  );
}

export function useThreadContext() {
  const context = useContext(ThreadContext);
  if (!context) {
    throw new Error("useThreadContext must be used within ThreadProvider");
  }
  return context;
}

// MessageContext for passing message ID down the tree
export const MessageContext = createContext<string | null>(null);
