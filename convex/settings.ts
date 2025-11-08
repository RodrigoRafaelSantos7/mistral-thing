import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { authComponent } from "./auth";
import { models } from "./schema";

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

    return settings ?? null;
  },
});

/**
 * Creates default settings if they don't exist, otherwise returns existing settings.
 * This mutation is idempotent and safe to call multiple times.
 *
 * @returns The settings ID
 * @throws {ConvexError} 401 if user not found/not authenticated
 */
export const create = mutation({
  args: {},
  returns: v.id("settings"),
  handler: async (ctx) => {
    const user = await authComponent.getAuthUser(ctx);

    if (!user) {
      throw new ConvexError({
        code: 401,
        message: "User not found. Please login to continue.",
        severity: "high",
      });
    }

    // Check if settings already exist
    const existing = await ctx.db
      .query("settings")
      .withIndex("by_userId", (q) => q.eq("userId", user._id as string))
      .unique();

    if (existing) {
      return existing._id;
    }

    // Create default settings if they don't exist
    const settingsId = await ctx.db.insert("settings", {
      userId: user._id,
      mode: "dark",
      theme: "default",
      modelId: "mistral-small-latest",
      pinnedModels: [
        "mistral-medium-latest",
        "codestral-latest",
        "mistral-small-latest",
      ],
    });

    return settingsId;
  },
});

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
    modelId: v.optional(models),
    pinnedModels: v.optional(v.array(models)),
    nickname: v.optional(v.string()),
    biography: v.optional(v.string()),
    instructions: v.optional(v.string()),
  },
  returns: v.id("settings"),
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
        message: "Settings not found.",
        severity: "medium",
      });
    }

    await ctx.db.patch(settings._id, args);

    return settings._id;
  },
});
