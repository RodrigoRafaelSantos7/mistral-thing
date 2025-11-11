import type {
  StreamBody,
  StreamId,
} from "@convex-dev/persistent-text-streaming";
import { PersistentTextStreaming } from "@convex-dev/persistent-text-streaming";
import { ConvexError, v } from "convex/values";
import { components } from "../_generated/api";
import {
  internalMutation,
  internalQuery,
  mutation,
  query,
} from "../_generated/server";
import { authComponent } from "../auth";
import { getSystemPrompt } from "./prompt";

const persistentTextStreaming = new PersistentTextStreaming(
  components.persistentTextStreaming
);

export const getStreamBody = query({
  args: {
    streamId: v.string(),
  },
  returns: v.object({
    text: v.string(),
    status: v.union(
      v.literal("pending"),
      v.literal("streaming"),
      v.literal("done"),
      v.literal("error"),
      v.literal("timeout")
    ),
  }),
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);

    if (!user) {
      throw new ConvexError({
        code: 401,
        message: "User not found",
        severity: "high",
      });
    }

    const message = await ctx.db
      .query("message")
      .filter((q) => q.eq(q.field("streamId"), args.streamId))
      .first();

    if (!message) {
      return { text: "", status: "pending" as const };
    }

    const thread = await ctx.db.get(message.threadId);

    if (!thread || thread.userId !== (user._id as string)) {
      throw new ConvexError({
        code: 403,
        message: "You are not allowed to access this stream",
        severity: "high",
      });
    }

    return await persistentTextStreaming.getStreamBody(
      ctx,
      args.streamId as StreamId
    );
  },
});

export const getStreamBodyInternal = internalQuery({
  args: {
    streamId: v.string(),
  },
  returns: v.union(
    v.object({
      text: v.string(),
      status: v.union(
        v.literal("pending"),
        v.literal("streaming"),
        v.literal("done"),
        v.literal("error"),
        v.literal("timeout")
      ),
    }),
    v.null()
  ),
  handler: async (ctx, args): Promise<StreamBody | null> => {
    const result = await persistentTextStreaming.getStreamBody(
      ctx,
      args.streamId as StreamId
    );
    return result;
  },
});

export const createStream = mutation({
  args: {
    threadId: v.id("thread"),
  },
  returns: v.object({
    messageId: v.id("message"),
    streamId: v.string(),
  }),
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);

    if (!user) {
      throw new ConvexError({
        code: 401,
        message: "User not found",
        severity: "high",
      });
    }

    const thread = await ctx.db.get(args.threadId);

    if (!thread) {
      throw new ConvexError({
        code: 404,
        message: "Thread not found",
        severity: "high",
      });
    }

    if (thread.userId !== (user._id as string)) {
      throw new ConvexError({
        code: 403,
        message: "You are not allowed to create streams for this thread",
        severity: "high",
      });
    }

    const streamId = await persistentTextStreaming.createStream(ctx);

    const messageId = await ctx.db.insert("message", {
      threadId: args.threadId,
      role: "assistant",
      content: "",
      updatedAt: Date.now(),
      streamId,
    });

    await ctx.db.patch(args.threadId, {
      messages: [...thread.messages, messageId],
      status: "streaming",
      updatedAt: Date.now(),
    });

    return { messageId, streamId };
  },
});

export const createStreamInternal = internalMutation({
  args: {
    threadId: v.id("thread"),
  },
  returns: v.object({
    messageId: v.id("message"),
    streamId: v.string(),
  }),
  handler: async (ctx, args) => {
    const thread = await ctx.db.get(args.threadId);

    if (!thread) {
      throw new ConvexError({
        code: 404,
        message: "Thread not found",
        severity: "high",
      });
    }

    const streamId = await persistentTextStreaming.createStream(ctx);

    const messageId = await ctx.db.insert("message", {
      threadId: args.threadId,
      role: "assistant",
      content: "",
      updatedAt: Date.now(),
      streamId,
    });

    await ctx.db.patch(args.threadId, {
      messages: [...thread.messages, messageId],
      status: "streaming",
      updatedAt: Date.now(),
    });

    return { messageId, streamId };
  },
});

export const updateMessageContent = internalMutation({
  args: {
    messageId: v.id("message"),
    content: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.patch(args.messageId, {
      content: args.content,
      updatedAt: Date.now(),
    });
    return null;
  },
});

export const completeStream = internalMutation({
  args: {
    threadId: v.id("thread"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.patch(args.threadId, {
      status: "ready",
      updatedAt: Date.now(),
    });
    return null;
  },
});

export const loadConversationContext = internalQuery({
  args: {
    threadId: v.id("thread"),
  },
  returns: v.array(
    v.object({
      role: v.union(
        v.literal("user"),
        v.literal("assistant"),
        v.literal("system")
      ),
      content: v.string(),
    })
  ),
  handler: async (ctx, args) => {
    const thread = await ctx.db.get(args.threadId);

    if (!thread) {
      throw new ConvexError({
        code: 404,
        message: "Thread not found",
        severity: "high",
      });
    }

    const messages = await ctx.db
      .query("message")
      .withIndex("by_threadId_updatedAt", (q) =>
        q.eq("threadId", args.threadId)
      )
      .order("asc")
      .collect();

    const hasAssistantMessage = messages.some(
      (msg) => msg.role === "assistant"
    );
    const isFirstMessage = !hasAssistantMessage;

    const result: Array<{
      role: "user" | "assistant" | "system";
      content: string;
    }> = [];

    if (isFirstMessage) {
      const settings = await ctx.db
        .query("settings")
        .withIndex("by_userId", (q) => q.eq("userId", thread.userId))
        .unique();

      if (settings) {
        const systemPrompt = getSystemPrompt(
          {
            nickname: settings.nickname ?? null,
            biography: settings.biography ?? null,
            instructions: settings.instructions ?? null,
          },
          []
        );
        result.push({
          role: "system",
          content: systemPrompt,
        });
      }
    }

    for (const message of messages) {
      if (message.role === "user" || message.role === "assistant") {
        result.push({
          role: message.role,
          content: message.content,
        });
      }
    }

    return result;
  },
});
