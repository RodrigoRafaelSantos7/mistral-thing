"use node";

import { v } from "convex/values";
import { internal } from "../_generated/api";
import type { Id } from "../_generated/dataModel";
import { internalAction } from "../_generated/server";

export const createStreamAndStart = internalAction({
  args: {
    threadId: v.id("thread"),
  },
  returns: v.object({
    messageId: v.id("message"),
    streamId: v.string(),
  }),
  handler: async (
    ctx,
    args
  ): Promise<{ messageId: Id<"message">; streamId: string }> => {
    const result: { messageId: Id<"message">; streamId: string } =
      await ctx.runMutation(internal.ai.streams.createStreamInternal, {
        threadId: args.threadId,
      });
    return result;
  },
});
