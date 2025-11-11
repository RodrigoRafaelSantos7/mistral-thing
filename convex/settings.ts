import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { authComponent } from "./auth";
import { modes, themes } from "./schema";

/**
 * Retrieves the user's settings with authorization checks.
 *
 * @returns The user's settings or null if not found
 * @throws {ConvexError} 401 if user not found/not authenticated
 */
export const get = query({
  args: {},
  handler: async (ctx) => {
    const user = await authComponent.getAuthUser(ctx);

    if (!user) {
      return null;
    }

    const settings = await ctx.db
      .query("settings")
      .withIndex("by_userId", (q) => q.eq("userId", user._id as string))
      .unique();

    if (!settings) {
      throw new ConvexError({
        code: 404,
        message:
          "Settings not found. There should always be settings for a user.",
        severity: "high",
      });
    }

    return settings;
  },
});

export const update = mutation({
  args: {
    mode: v.optional(modes),
    theme: v.optional(themes),
    modelId: v.optional(v.string()),
    pinnedModels: v.optional(v.array(v.string())),
    nickname: v.optional(v.string()),
    biography: v.optional(v.string()),
    instructions: v.optional(v.string()),
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

    const settings = await ctx.db
      .query("settings")
      .withIndex("by_userId", (q) => q.eq("userId", user._id as string))
      .unique();

    if (!settings) {
      throw new ConvexError({
        code: 404,
        message:
          "Settings not found. There should always be settings for a user.",
        severity: "high",
      });
    }

    return await ctx.db.patch(settings._id, args);
  },
});
