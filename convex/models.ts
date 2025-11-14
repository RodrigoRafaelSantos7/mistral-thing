import { ConvexError, v } from "convex/values";
import { query } from "@/convex/_generated/server";
import { authComponent } from "@/convex/auth";

/**
 * Retrieves all of the models.
 *
 * @returns All of the models
 * @throws {ConvexError} 404 if no models found
 */
export const list = query({
  args: {},
  returns: v.union(
    v.array(
      v.object({
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
      })
    ),
    v.null()
  ),
  handler: async (ctx) => {
    const user = await authComponent.getAuthUser(ctx).catch(() => null);

    if (!user) {
      return null;
    }

    const models = await ctx.db.query("model").collect();

    if (models.length === 0) {
      throw new ConvexError({
        code: 404,
        message: "No models found",
        severity: "high",
      });
    }

    return models.map((model) => ({
      modelId: model.modelId,
      name: model.name,
      description: model.description,
      capabilities: model.capabilities,
    }));
  },
});
