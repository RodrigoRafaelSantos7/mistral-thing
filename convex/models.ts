import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { authComponent } from "./auth";

/**
 * Retrieves all models with authorization checks.
 *
 * @returns All models
 * @throws {ConvexError} 401 if user not authenticated
 */
export const getAll = query({
  args: {},
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

    return models;
  },
});

export const seedModels = mutation({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    const modelsArray = [
      {
        name: "Codestral",
        model: "codestral-latest" as const,
        description:
          "Mistral's cutting-edge language model for coding released end of July 2025, Codestral specializes in low-latency, high-frequency tasks such as fill-in-the-middle (FIM), code correction and test generation.",
        capabilities: ["text-input" as const, "text-output" as const],
        icon: "codestral" as const,
        access: "premium-required" as const,
        credits: 1,
      },
      {
        name: "Mistral Medium 3.1",
        model: "mistral-medium-latest" as const,
        description:
          "Mistral's frontier-class multimodal model released August 2025. Improving tone and performance.",
        capabilities: [
          "text-input" as const,
          "image-input" as const,
          "text-output" as const,
        ],
        icon: "medium" as const,
        access: "premium-required" as const,
        credits: 1,
      },
      {
        name: "Mistral Small 3.2",
        model: "mistral-small-latest" as const,
        description:
          "Mistral's update to their previous small model, released June 2025. Ideal for quick tasks and small conversations.",
        capabilities: [
          "text-input" as const,
          "image-input" as const,
          "text-output" as const,
        ],
        icon: "small" as const,
        access: "premium-required" as const,
        credits: 1,
      },
    ];

    // Delete existing experiences
    await ctx.db
      .query("model")
      .collect()
      .then(async (existingModels) => {
        for (const model of existingModels) {
          await ctx.db.delete(model._id);
        }
      });

    // Insert new experiences
    for (const model of modelsArray) {
      await ctx.db.insert("model", model);
    }
    return null;
  },
});
