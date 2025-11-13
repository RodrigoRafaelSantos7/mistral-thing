/** biome-ignore-all lint/suspicious/noExplicitAny: This is fine */

import {
  PersistentTextStreaming,
  type StreamId,
  StreamIdValidator,
} from "@convex-dev/persistent-text-streaming";
import { Mistral } from "@mistralai/mistralai";
import { ConvexError, v } from "convex/values";
import type { Doc } from "@/convex/_generated/dataModel";
import { authComponent } from "@/convex/auth";
import { components, internal } from "./_generated/api";
import {
  httpAction,
  internalMutation,
  internalQuery,
  mutation,
  query,
} from "./_generated/server";

const mistralClient = new Mistral({
  apiKey: process.env.MISTRAL_API_KEY,
});

const persistentTextStreaming = new PersistentTextStreaming(
  components.persistentTextStreaming
);

/**
 * Retrieves the messages for a given conversation.
 * Internal version for HTTP actions (bypasses auth)
 *
 * @param conversationId - The id of the conversation
 * @returns The messages for the conversation
 */
export const getMessagesInternal = internalQuery({
  args: { threadId: v.id("thread") },
  handler: async (ctx, args) =>
    await ctx.db
      .query("messages")
      .withIndex("by_thread", (q) => q.eq("threadId", args.threadId))
      .collect(),
});

/**
 * Sends a message to a thread.
 *
 * @param threadId - The id of the thread
 * @param content - The content of the message
 * @returns The message
 */
export const sendMessage = mutation({
  args: {
    threadId: v.id("thread"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx).catch(() => null);

    if (!user) {
      throw new ConvexError({
        code: 401,
        message: "User not found. Please login to continue.",
        severity: "high",
      });
    }
    const thread = await ctx.db.get(args.threadId);

    if (!thread) {
      throw new ConvexError({
        code: 404,
        message: "Thread not found.",
        severity: "high",
      });
    }

    if (thread.userId !== user._id) {
      throw new ConvexError({
        code: 403,
        message: "You are not authorized to access this thread.",
        severity: "high",
      });
    }

    // Insert user message
    const userMessageId = await ctx.db.insert("messages", {
      threadId: args.threadId,
      role: "user",
      content: args.content,
    });

    // Create a stream for the AI response
    const streamId = await persistentTextStreaming.createStream(ctx);

    // Create the AI message with streaming enabled
    const aiMessageId = await ctx.db.insert("messages", {
      threadId: args.threadId,
      role: "assistant",
      content: "", // Start with empty content
      streamId,
      isStreaming: true,
      streamingComplete: false,
    });

    // Update thread timestamp
    await ctx.db.patch(args.threadId, {
      updatedAt: Date.now(),
    });

    return {
      userMessageId,
      aiMessageId,
      streamingMessageId: aiMessageId,
      streamId,
    };
  },
});

/**
 * @TODO - CHECK THIS QUERY AND SEE IF THE AUTH IS IS NEEDED
 * Retrieves the body of a stream.
 *
 * @param streamId - The id of the stream
 * @returns The body of the stream
 */
export const getStreamBody = query({
  args: {
    streamId: StreamIdValidator,
  },
  handler: async (ctx, args) =>
    await persistentTextStreaming.getStreamBody(ctx, args.streamId as StreamId),
});

/**
 * Marks a stream as complete.
 *
 * @param messageId - The id of the message
 * @param finalContent - The final content of the message
 * @returns The message
 */
export const markStreamComplete = internalMutation({
  args: {
    messageId: v.id("messages"),
    finalContent: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.messageId, {
      isStreaming: false,
      content: args.finalContent,
      streamingComplete: true,
    });
  },
});

export const streamChat = httpAction(async (ctx, request) => {
  const body = (await request.json()) as {
    streamId: string;
    threadId: string;
    userMessage: string;
    userId: string;
    messages?: Doc<"messages">[];
  };

  const generateChat = async (
    // biome-ignore lint/nursery/noShadow: This is fine
    ctx: any,
    _request: any,
    streamId: StreamId,
    chunkAppender: any
    // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: <explanation>
  ) => {
    try {
      console.log("Generate chat called with streamId:", streamId);

      // Get the message that we're streaming to
      const message = await ctx.runQuery(internal.chat.getMessageByStreamId, {
        streamId,
      });

      if (!message) {
        console.error("No message found for streamId:", streamId);
        await chunkAppender("Error: Message not found");
        return;
      }

      await ctx.runMutation(internal.chat.setThreadStatus, {
        threadId: message.threadId,
        status: "submitted",
      });

      // Get the thread to extract userId
      const thread = await ctx.runQuery(internal.chat.getThreadByIdInternal, {
        threadId: message.threadId,
      });

      if (!thread) {
        console.error("No thread found for threadId:", message.threadId);
        await chunkAppender("Error: Thread not found");
        return;
      }

      // Use body.userId if present, otherwise fall back to thread's userId
      const userId = body.userId || thread.userId;

      const userSettings = await ctx.runQuery(internal.chat.getUserSettings, {
        userId,
      });

      // Get conversation history from the conversation
      const allMessages = await ctx.runQuery(
        internal.chat.getMessagesInternal,
        {
          threadId: message.threadId,
        }
      );

      // Get the user's latest message (the one that triggered this response)
      const userMessages = allMessages.filter(
        (m: Doc<"messages">) => m.role === "user"
      );

      const latestUserMessage = userMessages.at(-1);

      if (!latestUserMessage) {
        // @TODO - HANDLE THIS, Figure out what to do here
      }

      await ctx.runMutation(internal.chat.setThreadStatus, {
        threadId: message.threadId,
        status: "streaming",
      });

      const userContent = latestUserMessage.content;
      const response = await mistralClient.chat.stream({
        model: userSettings.modelId,
        messages: [
          ...userMessages.map((m: Doc<"messages">) => ({
            role: m.role,
            content: m.content,
          })),
          { role: "user", content: userContent },
        ],
      });

      // Collect all streamed content
      let finalContent = "";
      for await (const chunk of response) {
        const content = chunk.data.choices[0].delta.content;
        if (content) {
          finalContent += content;
          await chunkAppender(content);
        }
      }

      // Mark the message as complete with the accumulated content
      await ctx.runMutation(internal.chat.markStreamComplete, {
        messageId: message._id,
        finalContent,
      });

      await ctx.runMutation(internal.chat.setThreadStatus, {
        threadId: message.threadId,
        status: "ready",
      });

      console.log("Stream completed successfully");
    } catch (error) {
      console.error("Chat generation error:", error);
      const errorMessage =
        "Sorry, an error occurred while generating the response.";
      await chunkAppender(errorMessage);

      // Try to mark the message as complete even on error
      try {
        const errorMessageDoc = await ctx.runQuery(
          internal.chat.getMessageByStreamId,
          {
            streamId,
          }
        );
        if (errorMessageDoc) {
          await ctx.runMutation(internal.chat.markStreamComplete, {
            messageId: errorMessageDoc._id,
            finalContent: errorMessage,
          });

          await ctx.runMutation(internal.chat.setThreadStatus, {
            threadId: errorMessageDoc.threadId,
            status: "ready",
          });
        }
      } catch (e) {
        console.error("Failed to mark message as complete on error:", e);
      }
    }
  };

  const response = await persistentTextStreaming.stream(
    ctx,
    request,
    body.streamId as StreamId,
    generateChat
  );

  // Set CORS headers appropriately.
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Vary", "Origin");
  return response;
});

// Helper queries for the HTTP action

/**
 * Retrieves a message by its streamId.
 *
 * @param streamId - The id of the stream
 * @returns The message
 */
export const getMessageByStreamId = internalQuery({
  args: { streamId: v.string() },
  handler: async (ctx, args) =>
    await ctx.db
      .query("messages")
      .filter((q) => q.eq(q.field("streamId"), args.streamId))
      .first(),
});

/**
 * Retrieves a conversation by its id.
 *
 * @param conversationId - The id of the conversation
 * @returns The conversation
 */
export const getThreadById = query({
  args: { threadId: v.id("thread") },
  handler: async (ctx, args) => await ctx.db.get(args.threadId),
});

/**
 * Retrieves a thread by its id (internal version for HTTP actions).
 *
 * @param threadId - The id of the thread
 * @returns The thread
 */
export const getThreadByIdInternal = internalQuery({
  args: { threadId: v.id("thread") },
  handler: async (ctx, args) => await ctx.db.get(args.threadId),
});

/**
 * Retrieves the user's settings.
 *
 * @param userId - The id of the user
 * @returns The user's settings
 */
export const getUserSettings = internalQuery({
  args: { userId: v.string() },
  handler: async (ctx, args) =>
    await ctx.db
      .query("settings")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .unique(),
});

/**
 * Sets the status of a thread.
 *
 * @param threadId - The id of the thread
 * @param status - The status of the thread
 * @returns The thread
 */
export const setThreadStatus = internalMutation({
  args: {
    threadId: v.id("thread"),
    status: v.union(
      v.literal("ready"),
      v.literal("streaming"),
      v.literal("submitted")
    ),
  },
  handler: async (ctx, args) =>
    await ctx.db.patch(args.threadId, {
      status: args.status,
    }),
});
