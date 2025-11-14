import { Mistral } from "@mistralai/mistralai";
import { ConvexError, v } from "convex/values";
import { authComponent } from "../convex/auth";
import { internal } from "./_generated/api";
import { internalAction, internalMutation, query } from "./_generated/server";

// These are the open source models that are supported by the app.
// If a model is not in this list, it will not be displayed in the app.
const supportedModels = [
  "magistral-small-latest",
  "mistral-small-latest",
  "open-mistral-nemo",
  "pixtral-12b-2409",
];

/**
 * Retrieves all of the models.
 *
 * @returns All of the models
 * @throws {ConvexError} 404 if no models found
 */
export const list = query({
  handler: async (ctx) => {
    const user = await authComponent.getAuthUser(ctx).catch(() => null);

    if (!user) {
      throw new ConvexError({
        code: 401,
        message: "User not found. Please login to continue.",
        severity: "high",
      });
    }

    const models = await ctx.db.query("model").collect();

    return models;
  },
});

/**
 * Creates a model in the database.
 *
 * @param args - The model to create
 * @returns The created model
 * @throws {ConvexError} 500 if model creation fails
 */
export const createModelInternal = internalMutation({
  args: {
    model: v.object({
      modelId: v.string(),
      name: v.string(),
      description: v.string(),
      capabilities: v.object({
        completionChat: v.optional(v.boolean()),
        completionFim: v.optional(v.boolean()),
        functionCalling: v.optional(v.boolean()),
        fineTuning: v.optional(v.boolean()),
        vision: v.optional(v.boolean()),
        classification: v.optional(v.boolean()),
      }),
    }),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("model", args.model);
  },
});

/**
 * Retrieves the models from Mistral.
 *
 * @returns The models from Mistral
 * @throws {ConvexError} 500 if model retrieval fails
 */
export const getMistralModels = internalAction({
  handler: async (ctx) => {
    const mistralClient = new Mistral({
      apiKey: process.env.MISTRAL_API_KEY as string,
    });

    try {
      const mistralModels = await mistralClient.models.list();

      if (!mistralModels.data) {
        throw new ConvexError({
          code: 500,
          message: "No Mistral models found",
          severity: "high",
        });
      }

      const formattedModels = mistralModels.data?.map((model) => ({
        modelId: model.id,
        name: model.name ?? "",
        description: model.description ?? "",
        capabilities: model.capabilities,
      }));

      for (const model of formattedModels) {
        const isSupported = supportedModels.includes(model.modelId);

        if (!isSupported) {
          continue;
        }

        await ctx.runMutation(internal.models.createModelInternal, {
          model,
        });
      }
    } catch (error) {
      console.error(error);
      throw new ConvexError({
        code: 500,
        message: "Failed to get Mistral models",
        severity: "high",
      });
    }
  },
});
