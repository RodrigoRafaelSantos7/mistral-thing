import { ConvexError, v } from "convex/values";
import { authComponent } from "../convex/auth";
import { mutation, query } from "./_generated/server";

/**
 * Retrieves the user's settings with authorization checks.
 *
 * @returns The user's settings
 * @throws {ConvexError} 401 if user not found/not authenticated
 */
export const get = query({
  handler: async (ctx) => {
    const user = await authComponent.getAuthUser(ctx).catch(() => null);

    if (!user) {
      throw new ConvexError({
        code: 401,
        message: "User not found. Please login to continue.",
        severity: "high",
      });
    }

    const settings = await ctx.db
      .query("settings")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .unique();

    if (!settings) {
      throw new ConvexError({
        code: 404,
        message:
          "Settings not found. (There should always be settings for a user.)",
        severity: "high",
      });
    }

    return settings;
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
    mode: v.optional(v.union(v.literal("light"), v.literal("dark"))),
    theme: v.optional(
      v.union(
        v.literal("default"),
        v.literal("t3-chat"),
        v.literal("claymorphism"),
        v.literal("claude"),
        v.literal("graphite"),
        v.literal("amethyst-haze"),
        v.literal("vercel")
      )
    ),
    modelId: v.optional(v.string()),
    pinnedModels: v.optional(v.array(v.string())),
    nickname: v.optional(v.string()),
    biography: v.optional(v.string()),
    instructions: v.optional(v.string()),
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

    const settings = await ctx.db
      .query("settings")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .unique();

    if (!settings) {
      throw new ConvexError({
        code: 404,
        message: "Settings not found.",
        severity: "high",
      });
    }

    return await ctx.db.patch(settings._id, args);
  },
});
