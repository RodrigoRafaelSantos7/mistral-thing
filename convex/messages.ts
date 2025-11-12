import { ConvexError, v } from "convex/values";
import { mutation, query } from "@/convex/_generated/server";
import type { Id } from "./_generated/dataModel";
import { authComponent } from "./auth";

/**
 * Lists all messages for a given chatId, ordered by creation time.
 */
export const list = query({
  args: {
    chatId: v.string(),
  },
  returns: v.array(
    v.object({
      _id: v.id("messages"),
      _creationTime: v.number(),
      chatId: v.string(),
      content: v.optional(v.string()),
      role: v.union(
        v.literal("system"),
        v.literal("user"),
        v.literal("assistant"),
        v.literal("data")
      ),
      parts: v.optional(v.any()),
      userId: v.optional(v.string()),
      messageGroupId: v.optional(v.string()),
      model: v.optional(v.string()),
    })
  ),
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx).catch(() => null);

    if (!user) {
      return [];
    }

    // Verify the chat exists and belongs to the user
    try {
      const chat = await ctx.db.get(args.chatId as Id<"chat">);
      if (!chat || chat.userId !== user._id) {
        return [];
      }
    } catch {
      // Chat doesn't exist
      return [];
    }

    const messages = await ctx.db
      .query("messages")
      .withIndex("by_chatId", (q) => q.eq("chatId", args.chatId))
      .order("asc")
      .collect();

    return messages;
  },
});

/**
 * Creates a new message in Convex.
 */
export const create = mutation({
  args: {
    chatId: v.string(),
    content: v.optional(v.string()),
    role: v.union(
      v.literal("system"),
      v.literal("user"),
      v.literal("assistant"),
      v.literal("data")
    ),
    parts: v.optional(v.any()),
    userId: v.optional(v.string()),
    messageGroupId: v.optional(v.string()),
    model: v.optional(v.string()),
  },
  returns: v.id("messages"),
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);

    if (!user) {
      throw new ConvexError({
        code: 401,
        message: "User not found. Please login to continue.",
        severity: "high",
      });
    }

    // Verify the chat exists and belongs to the user
    try {
      const chat = await ctx.db.get(args.chatId as Id<"chat">);
      if (!chat || chat.userId !== user._id) {
        throw new ConvexError({
          code: 404,
          message: "Chat not found.",
          severity: "high",
        });
      }
    } catch (error) {
      if (error instanceof ConvexError) {
        throw error;
      }
      throw new ConvexError({
        code: 404,
        message: "Chat not found.",
        severity: "high",
      });
    }

    const messageId = await ctx.db.insert("messages", {
      chatId: args.chatId,
      content: args.content,
      role: args.role,
      parts: args.parts,
      userId: args.userId || user._id,
      messageGroupId: args.messageGroupId,
      model: args.model,
    });

    return messageId;
  },
});

/**
 * Creates multiple messages at once (for bulk sync).
 */
export const createBatch = mutation({
  args: {
    messages: v.array(
      v.object({
        chatId: v.string(),
        content: v.optional(v.string()),
        role: v.union(
          v.literal("system"),
          v.literal("user"),
          v.literal("assistant"),
          v.literal("data")
        ),
        parts: v.optional(v.any()),
        userId: v.optional(v.string()),
        messageGroupId: v.optional(v.string()),
        model: v.optional(v.string()),
      })
    ),
  },
  returns: v.array(v.id("messages")),
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);

    if (!user) {
      throw new ConvexError({
        code: 401,
        message: "User not found. Please login to continue.",
        severity: "high",
      });
    }

    const messageIds: Id<"messages">[] = [];

    for (const messageData of args.messages) {
      // Verify the chat exists and belongs to the user
      try {
        const chat = await ctx.db.get(messageData.chatId as Id<"chat">);
        if (!chat || chat.userId !== user._id) {
          throw new ConvexError({
            code: 404,
            message: `Chat not found: ${messageData.chatId}`,
            severity: "high",
          });
        }
      } catch (error) {
        if (error instanceof ConvexError) {
          throw error;
        }
        throw new ConvexError({
          code: 404,
          message: `Chat not found: ${messageData.chatId}`,
          severity: "high",
        });
      }

      const messageId = await ctx.db.insert("messages", {
        chatId: messageData.chatId,
        content: messageData.content,
        role: messageData.role,
        parts: messageData.parts,
        userId: messageData.userId || user._id,
        messageGroupId: messageData.messageGroupId,
        model: messageData.model,
      });

      messageIds.push(messageId);
    }

    return messageIds;
  },
});

export const deleteMessagesOfChat = mutation({
  args: {
    chatId: v.id("chat"),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);

    if (!user) {
      throw new ConvexError({
        code: 401,
        message: "User not found. Please login to continue.",
        severity: "high",
      });
    }

    const chat = await ctx.db.get(args.chatId);

    if (!chat) {
      throw new ConvexError({
        code: 404,
        message: "Chat not found.",
        severity: "high",
      });
    }

    if (chat.userId !== user._id) {
      throw new ConvexError({
        code: 403,
        message: "You are not the owner of this chat.",
        severity: "high",
      });
    }

    const messages = await ctx.db
      .query("messages")
      .withIndex("by_chatId", (q) => q.eq("chatId", args.chatId))
      .collect();

    for (const message of messages) {
      await ctx.db.delete(message._id);
    }
  },
});
