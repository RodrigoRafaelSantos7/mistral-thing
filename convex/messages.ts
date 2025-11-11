import { ConvexError, v } from "convex/values";
import { query } from "./_generated/server";
import { authComponent } from "./auth";

export const getMessageById = query({
  args: {
    messageId: v.id("message"),
  },
  returns: v.object({
    _id: v.id("message"),
    _creationTime: v.float64(),
    threadId: v.id("thread"),
    role: v.union(
      v.literal("user"),
      v.literal("assistant"),
      v.literal("tool"),
      v.literal("system")
    ),
    content: v.string(),
    updatedAt: v.float64(),
    streamId: v.optional(v.string()),
    hasNextMessage: v.boolean(),
    hasPreviousMessage: v.boolean(),
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

    const message = await ctx.db.get(args.messageId);

    if (!message) {
      throw new ConvexError({
        code: 404,
        message: "Message not found",
        severity: "high",
      });
    }

    const thread = await ctx.db.get(message.threadId);

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
        message: "You are not allowed to access this message",
        severity: "high",
      });
    }

    const messageIndex = thread.messages.indexOf(args.messageId);

    if (messageIndex === -1) {
      throw new ConvexError({
        code: 404,
        message: "Message not found in thread",
        severity: "high",
      });
    }

    const hasNextMessage = messageIndex < thread.messages.length - 1;
    const hasPreviousMessage = messageIndex > 0;

    return {
      ...message,
      hasNextMessage,
      hasPreviousMessage,
    };
  },
});
