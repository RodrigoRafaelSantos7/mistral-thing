import { query } from "./_generated/server";
import { authComponent, createAuth } from "./auth";

/**
 * Retrieves the current authenticated user's session.
 *
 * @returns The current session or null if not authenticated
 */
export const getSession = query({
  handler: async (ctx) => {
    const { auth, headers } = await authComponent.getAuth(createAuth, ctx);
    try {
      const session = await auth.api.getSession({
        headers,
      });
      return session;
    } catch {
      return null;
    }
  },
});

/**
 * Retrieves all active sessions for the current authenticated user.
 *
 * @returns Array of all user sessions
 */
export const getAllSessions = query({
  handler: async (ctx) => {
    const { auth, headers } = await authComponent.getAuth(createAuth, ctx);
    try {
      const sessions = await auth.api.listSessions({
        headers,
      });
      return sessions;
    } catch {
      return [];
    }
  },
});
