import { ConvexError, v } from "convex/values";
import { internalQuery, mutation, query } from "./_generated/server";
import { authComponent } from "./auth";

const messageValidator = v.object({
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
});

const threadValidator = v.object({
  _id: v.id("thread"),
  _creationTime: v.float64(),
  userId: v.string(),
  title: v.optional(v.string()),
  status: v.union(
    v.literal("ready"),
    v.literal("streaming"),
    v.literal("submitted")
  ),
  updatedAt: v.float64(),
  messages: v.array(messageValidator),
});

export const getAllThreadsOfUser = query({
  args: {},
  returns: v.array(threadValidator),
  handler: async (ctx) => {
    const user = await authComponent.getAuthUser(ctx);

    if (!user) {
      throw new ConvexError({
        code: 401,
        message: "User not found",
        severity: "high",
      });
    }

    const threads = await ctx.db
      .query("thread")
      .withIndex("by_userId_updatedAt", (q) =>
        q.eq("userId", user._id as string)
      )
      .collect();

    const threadsWithMessages = await Promise.all(
      threads.map(async (thread) => {
        const messages = await ctx.db
          .query("message")
          .withIndex("by_threadId_updatedAt", (q) =>
            q.eq("threadId", thread._id)
          )
          .order("asc")
          .collect();

        return {
          ...thread,
          messages,
        };
      })
    );

    return threadsWithMessages;
  },
});

export const getThreadById = query({
  args: {
    threadId: v.id("thread"),
  },
  returns: threadValidator,
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
        message: "You are not allowed to access this thread",
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

    return {
      ...thread,
      messages,
    };
  },
});

export const updateTitle = mutation({
  args: {
    threadId: v.id("thread"),
    title: v.optional(v.string()),
  },
  returns: v.null(),
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
        message: "You are not allowed to update this thread",
        severity: "high",
      });
    }

    await ctx.db.patch(args.threadId, {
      title: args.title,
      updatedAt: Date.now(),
    });

    return null;
  },
});

export const deleteThread = mutation({
  args: {
    threadId: v.id("thread"),
  },
  returns: v.null(),
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
        message: "You are not allowed to delete this thread",
        severity: "high",
      });
    }

    // Delete all messages associated with this thread
    const messages = await ctx.db
      .query("message")
      .withIndex("by_threadId_updatedAt", (q) =>
        q.eq("threadId", args.threadId)
      )
      .collect();

    for (const message of messages) {
      await ctx.db.delete(message._id);
    }

    // Delete the thread
    await ctx.db.delete(args.threadId);

    return null;
  },
});

export const createMessage = mutation({
  args: {
    threadId: v.id("thread"),
    content: v.string(),
  },
  returns: v.id("message"),
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
        message: "You are not allowed to add messages to this thread",
        severity: "high",
      });
    }

    const messageId = await ctx.db.insert("message", {
      threadId: args.threadId,
      role: "user",
      content: args.content,
      updatedAt: Date.now(),
    });

    await ctx.db.patch(args.threadId, {
      messages: [...thread.messages, messageId],
      updatedAt: Date.now(),
    });

    return messageId;
  },
});

export const getThreadForStream = internalQuery({
  args: {
    threadId: v.id("thread"),
  },
  returns: v.object({
    userId: v.string(),
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

    return {
      userId: thread.userId,
    };
  },
});
