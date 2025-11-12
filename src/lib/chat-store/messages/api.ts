import type { UIMessage } from "ai";
import type { Id } from "@/convex/_generated/dataModel";
import { readFromIndexedDB, writeToIndexedDB } from "@/lib/chat-store/persist";

type MessageAISDK = UIMessage<{ createdAt: string }>;

// Convex message format (from the database)
type ConvexMessage = {
  _id: Id<"messages">;
  _creationTime: number;
  chatId: string;
  content?: string;
  role: "system" | "user" | "assistant" | "data";
  parts?: unknown;
  userId?: string;
  messageGroupId?: string;
  model?: string;
};

function ensureCreatedAt(message: MessageAISDK): MessageAISDK {
  const createdAt =
    (message.metadata &&
      (message.metadata as { createdAt?: string }).createdAt) ||
    new Date().toISOString();
  return {
    ...message,
    metadata: {
      ...(message.metadata || {}),
      createdAt,
    },
  };
}

export async function cacheMessages(
  chatId: string,
  messages: MessageAISDK[]
): Promise<void> {
  const normalized = messages.map(ensureCreatedAt);
  await writeToIndexedDB("messages", { id: chatId, messages: normalized });
}

export async function clearMessagesCache(chatId: string): Promise<void> {
  await writeToIndexedDB("messages", { id: chatId, messages: [] });
}

export async function clearCachedMessagesForChat(
  chatId: string
): Promise<void> {
  await clearMessagesCache(chatId);
}

type ChatMessageEntry = {
  id: string;
  messages: MessageAISDK[];
};

export async function getCachedMessages(
  chatId: string
): Promise<MessageAISDK[]> {
  const entry = await readFromIndexedDB<ChatMessageEntry>("messages", chatId);

  if (!entry || Array.isArray(entry)) {
    return [];
  }

  return (entry.messages || [])
    .map(ensureCreatedAt)
    .sort(
      (a, b) =>
        +new Date((a.metadata as { createdAt: string }).createdAt) -
        +new Date((b.metadata as { createdAt: string }).createdAt)
    );
}

/**
 * Converts a Convex message to UIMessage format
 */
export function convexToUIMessage(convexMsg: ConvexMessage): MessageAISDK {
  const createdAt = new Date(convexMsg._creationTime).toISOString();

  // Map 'data' role to 'assistant' since UIMessage doesn't support 'data'
  const role = convexMsg.role === "data" ? "assistant" : convexMsg.role;

  // Convert parts or create text part from content
  let parts: MessageAISDK["parts"] = [];
  if (convexMsg.parts && Array.isArray(convexMsg.parts)) {
    parts = convexMsg.parts as MessageAISDK["parts"];
  } else if (convexMsg.content) {
    // Create a text part from content if no parts exist
    parts = [{ type: "text", text: convexMsg.content }];
  }

  return {
    id: convexMsg._id,
    role: role as "system" | "user" | "assistant",
    parts,
    metadata: {
      createdAt,
      convexId: convexMsg._id,
      userId: convexMsg.userId,
      messageGroupId: convexMsg.messageGroupId,
      model: convexMsg.model,
    } as { createdAt: string } & {
      convexId?: string;
      userId?: string;
      messageGroupId?: string;
      model?: string;
    },
  };
}

/**
 * Converts a UIMessage to Convex message format
 */
export function uiMessageToConvex(
  message: MessageAISDK,
  chatId: string
): Omit<ConvexMessage, "_id" | "_creationTime"> {
  const metadata = message.metadata as
    | {
        createdAt?: string;
        userId?: string;
        messageGroupId?: string;
        model?: string;
        convexId?: string;
      }
    | undefined;

  // Extract text content from parts
  let content = "";
  if (message.parts && message.parts.length > 0) {
    // Extract text from parts
    const textParts = message.parts.filter(
      (part): part is { type: "text"; text: string } =>
        typeof part === "object" &&
        part !== null &&
        "type" in part &&
        part.type === "text" &&
        "text" in part
    );
    content = textParts.map((p) => p.text).join("");
  }

  return {
    chatId,
    content: content || undefined,
    role: message.role as ConvexMessage["role"],
    parts: message.parts as unknown,
    userId: metadata?.userId,
    messageGroupId: metadata?.messageGroupId,
    model: metadata?.model,
  };
}

/**
 * Converts an array of Convex messages to UIMessage format
 */
export function convexMessagesToUI(
  convexMessages: ConvexMessage[]
): MessageAISDK[] {
  return convexMessages.map(convexToUIMessage).sort((a, b) => {
    const aTime = new Date(
      (a.metadata as { createdAt: string }).createdAt
    ).getTime();
    const bTime = new Date(
      (b.metadata as { createdAt: string }).createdAt
    ).getTime();
    return aTime - bTime;
  });
}

// Export types for use in provider
export type { ConvexMessage };
