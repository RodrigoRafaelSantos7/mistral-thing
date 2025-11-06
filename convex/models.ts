import { ConvexError } from "convex/values";
import { query } from "./_generated/server";
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
