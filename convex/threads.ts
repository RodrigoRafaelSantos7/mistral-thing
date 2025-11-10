import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { authComponent } from "./auth";
import { status } from "./schema";

/**
 * List the threads for a given user.
 *
 * @param ctx - The context object.
 * @returns The threads for the user.
 */
export const listThreadsByUserId = query({
  args: {},
  handler: async (ctx) => {
    const user = await authComponent.getAuthUser(ctx);

    if (!user) {
      throw new ConvexError({
        code: 401,
        message: "User not found. Please login to continue.",
        severity: "high",
      });
    }

    const threads = await ctx.db
      .query("thread")
      .withIndex("by_userId_updatedAt", (q) =>
        q.eq("userId", user._id as string)
      )
      .collect();

    return threads;
  },
});

/**
 * Create a thread for a given user.
 *
 * @param ctx - The context object.
 * @param args - The arguments for the mutation.
 * @returns The thread.
 */
export const createThread = mutation({
  args: { userId: v.id("user") },
  handler: async (ctx, args) => {
    const thread = await ctx.db.insert("thread", {
      userId: args.userId,
      updatedAt: Date.now(),
    });
    return thread;
  },
});

/**
 * Update a thread for a given user.
 *
 * @param ctx - The context object.
 * @param args - The arguments for the mutation.
 * @returns The thread.
 */
export const updateThread = mutation({
  args: {
    threadId: v.id("thread"),
    title: v.optional(v.string()),
    status: v.optional(status),
    streamId: v.optional(v.string()),
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
        message: "You are not authorized to update this thread.",
        severity: "high",
      });
    }

    await ctx.db.patch(args.threadId, {
      title: args.title,
      status: args.status,
      updatedAt: Date.now(),
    });
  },
});

/**
 * Delete a thread and all of its messages.
 *
 * @param ctx - The context object.
 * @param args - The arguments for the mutation.
 * @returns The result of the mutation.
 */
export const deleteThread = mutation({
  args: { threadId: v.id("thread") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.threadId);
  },
});
