import { ConvexError, v } from "convex/values";
import { authComponent } from "@/convex/auth";
import { modes, themes } from "@/convex/schema";
import { mutation, query } from "./_generated/server";

/**
 * Retrieves the user's settings with authorization checks.
 *
 * @returns The user's settings
 * @throws {ConvexError} 401 if user not found/not authenticated
 */
export const get = query({
  returns: v.union(
    v.object({
      mode: modes,
      theme: themes,
      nickname: v.optional(v.string()),
      biography: v.optional(v.string()),
      instructions: v.optional(v.string()),
      modelId: v.string(),
      pinnedModels: v.array(v.string()),
    }),
    v.null()
  ),
  handler: async (ctx) => {
    const user = await authComponent.getAuthUser(ctx).catch(() => null);

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
        message: "Settings not found. (This should never happen.)",
        severity: "high",
      });
    }

    return {
      mode: settings.mode,
      theme: settings.theme,
      nickname: settings.nickname,
      biography: settings.biography,
      instructions: settings.instructions,
      modelId: settings.modelId,
      pinnedModels: settings.pinnedModels,
    };
  },
});

/**
 * Updates the user's settings.
 *
 * @param args - The settings to update
 * @returns The updated settings
 * @throws {ConvexError} 401 if user not found/not authenticated
 * @throws {ConvexError} 404 if settings not found
 */
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
