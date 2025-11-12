import { query } from "@/convex/_generated/server";
import { authComponent } from "@/convex/auth";

/**
 * Retrieves the user's information with authorization checks.
 *
 * @returns The user's information
 * @throws {ConvexError} 401 if user not found/not authenticated
 */
export const get = query({
  handler: async (ctx) => {
    const user = await authComponent.getAuthUser(ctx).catch(() => null);

    if (!user) {
      return null;
    }

    return {
      id: user._id as string,
      name: user.name,
      email: user.email,
      image: user.image,
    };
  },
});
