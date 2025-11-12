import { ConvexError, v } from "convex/values";
import { query } from "@/convex/_generated/server";
import { authComponent } from "./auth";

export const getChatMessages = query({
  args: { chatId: v.id("chat") },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx).catch(() => null);

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
        message: "You are not allowed to access this chat.",
        severity: "high",
      });
    }

    const messages = await ctx.db
      .query("message")
      .withIndex("by_chatId", (q) => q.eq("chatId", args.chatId))
      .order("desc")
      .collect();

    return messages.map((message) => ({
      id: message._id,
      content: message.content,
      role: message.role,
      chatId: message.chatId,
      userId: message.userId,
      modelId: message.modelId,
      createdAt: message._creationTime,
    }));
  },
});
