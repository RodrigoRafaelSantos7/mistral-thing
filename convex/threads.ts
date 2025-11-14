import { ConvexError, v } from "convex/values";
import { authComponent } from "@/convex/auth";
import { mutation, query } from "./_generated/server";

/**
 * Retrieves the user's threads.
 *
 * @returns The user's threads
 * @throws {ConvexError} 401 if user not found/not authenticated
 */
export const getThreadsForUser = query({
  args: {},
  handler: async (ctx) => {
    const user = await authComponent.getAuthUser(ctx).catch(() => null);

    if (!user) {
      return null;
    }

    return await ctx.db
      .query("thread")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .order("desc")
      .collect();
  },
});

/**
 * Creates a new thread for the user.
 *
 * @returns The new threadId
 * @throws {ConvexError} 401 if user not found/not authenticated
 */
export const create = mutation({
  args: {
    slug: v.string(),
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

    return await ctx.db.insert("thread", {
      userId: user._id,
      slug: args.slug,
      status: "streaming",
      updatedAt: Date.now(),
    });
  },
});

/**
 * Updates a thread for the user.
 *
 * @returns The updated thread
 * @throws {ConvexError} 401 if user not found/not authenticated
 */
export const update = mutation({
  args: {
    id: v.id("thread"),
    title: v.optional(v.string()),
    status: v.optional(
      v.union(
        v.literal("ready"),
        v.literal("streaming"),
        v.literal("submitted")
      )
    ),
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

    const thread = await ctx.db.get(args.id);

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

    return await ctx.db.patch(args.id, {
      title: args.title,
      status: args.status,
      updatedAt: Date.now(),
    });
  },
});

/**
 * Retrieves a thread by its slug.
 *
 * @param slug - The slug of the thread
 * @returns The thread or null if not found
 * @throws {ConvexError} 401 if user not found/not authenticated
 */
export const getThreadBySlug = query({
  args: {
    slug: v.string(),
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

    const thread = await ctx.db
      .query("thread")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();

    if (!thread) {
      return null;
    }

    if (thread.userId !== user._id) {
      throw new ConvexError({
        code: 403,
        message: "You are not authorized to access this thread.",
        severity: "high",
      });
    }

    return thread;
  },
});

/**
 * Removes a thread for the user.
 *
 * @returns The removed thread
 * @throws {ConvexError} 401 if user not found/not authenticated
 */
export const remove = mutation({
  args: {
    id: v.id("thread"),
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

    const thread = await ctx.db.get(args.id);

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
        message: "You are not authorized to remove this thread.",
        severity: "high",
      });
    }

    return await ctx.db.delete(args.id);
  },
});
