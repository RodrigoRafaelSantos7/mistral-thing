import { ConvexError, v } from "convex/values";
import { query } from "@/convex/_generated/server";
import { authComponent } from "@/convex/auth";

/**
 * Retrieves the messages for a given thread.
 *
 * @param threadId - The id of the thread
 * @returns The messages for the thread
 * @throws {ConvexError} 401 if user not found/not authenticated
 * @throws {ConvexError} 403 if user is not authorized to access the thread
 * @throws {ConvexError} 404 if thread not found
 */
export const getMessagesForThread = query({
  args: { threadId: v.id("thread") },
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

    return await ctx.db
      .query("messages")
      .withIndex("by_thread", (q) => q.eq("threadId", args.threadId))
      .order("desc")
      .collect();
  },
});
