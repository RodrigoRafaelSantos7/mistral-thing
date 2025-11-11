import { Mistral } from "@mistralai/mistralai";
import { ConvexError, v } from "convex/values";
import { internal } from "./_generated/api";
import { internalAction, internalMutation, query } from "./_generated/server";
import { authComponent } from "./auth";

const mistral = new Mistral({
  apiKey: process.env.MISTRAL_API_KEY,
});

/**
 * Retrieves all models from the database with authorization checks.
 *
 * @returns All models from the models table
 * @throws {ConvexError} 401 if user not authenticated
 */
export const getAll = query({
  args: {},
  returns: v.array(
    v.object({
      id: v.string(),
      name: v.union(v.string(), v.null()),
      description: v.union(v.string(), v.null()),
      capabilities: v.object({
        completionChat: v.optional(v.boolean()),
        completionFim: v.optional(v.boolean()),
        functionCalling: v.optional(v.boolean()),
        fineTuning: v.optional(v.boolean()),
        vision: v.optional(v.boolean()),
        classification: v.optional(v.boolean()),
      }),
    })
  ),
  handler: async (ctx) => {
    const user = await authComponent.getAuthUser(ctx);

    if (!user) {
      throw new ConvexError({
        code: 401,
        message: "Please login to continue.",
        severity: "high",
      });
    }

    const models = await ctx.db.query("model").collect();

    return models.map((model) => ({
      id: model.modelId,
      name: model.name,
      description: model.description,
      capabilities: model.capabilities,
    }));
  },
});

/**
 * Seeds the models table with all available models from Mistral API.
 * This function fetches models from Mistral and upserts them into the database.
 * Only includes models that:
 * - Are not deprecated (deprecation field is null or undefined)
 * - Have "latest" in their model ID
 */
export const seedModels = internalAction({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    const mistralModels = await mistral.models.list();

    if (!mistralModels.data) {
      throw new ConvexError({
        code: 500,
        message: "Failed to fetch models from Mistral API.",
        severity: "high",
      });
    }

    for (const model of mistralModels.data) {
      // Skip deprecated models
      if (model.deprecation != null) {
        continue;
      }

      // Only include models with "latest" in their ID
      if (!model.id.includes("latest")) {
        continue;
      }

      if (
        !(
          model.id.includes("magistral") ||
          model.id.includes("ministral") ||
          model.id.includes("codestral") ||
          model.id.includes("mistral")
        )
      ) {
        continue;
      }

      if (model.id.includes("ocr") || model.id.includes("moderation")) {
        continue;
      }

      await ctx.runMutation(internal.models.upsertModel, {
        modelId: model.id,
        name: model.name ?? null,
        description: model.description ?? null,
        capabilities: {
          completionChat: model.capabilities?.completionChat,
          completionFim: model.capabilities?.completionFim,
          functionCalling: model.capabilities?.functionCalling,
          fineTuning: model.capabilities?.fineTuning,
          vision: model.capabilities?.vision,
          classification: model.capabilities?.classification,
        },
      });
    }

    return null;
  },
});

/**
 * Upserts a model into the models table.
 * Updates the model if it exists, otherwise inserts a new one.
 */
export const upsertModel = internalMutation({
  args: {
    modelId: v.string(),
    name: v.union(v.string(), v.null()),
    description: v.union(v.string(), v.null()),
    capabilities: v.object({
      completionChat: v.optional(v.boolean()),
      completionFim: v.optional(v.boolean()),
      functionCalling: v.optional(v.boolean()),
      fineTuning: v.optional(v.boolean()),
      vision: v.optional(v.boolean()),
      classification: v.optional(v.boolean()),
    }),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const existingModel = await ctx.db
      .query("model")
      .withIndex("by_modelId", (q) => q.eq("modelId", args.modelId))
      .first();

    if (existingModel) {
      await ctx.db.patch(existingModel._id, {
        name: args.name,
        description: args.description,
        capabilities: args.capabilities,
      });
    } else {
      await ctx.db.insert("model", {
        modelId: args.modelId,
        name: args.name,
        description: args.description,
        capabilities: args.capabilities,
      });
    }

    return null;
  },
});
