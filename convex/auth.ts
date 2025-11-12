import {
  type AuthFunctions,
  createClient,
  type GenericCtx,
} from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import { requireActionCtx } from "@convex-dev/better-auth/utils";
import { betterAuth } from "better-auth";
import { magicLink } from "better-auth/plugins";
import { query } from "@/convex/_generated/server";
import { sendMagicLink } from "@/convex/email/email";
import { components, internal } from "./_generated/api";
import type { DataModel } from "./_generated/dataModel";

const siteUrl = process.env.SITE_URL as string;

const authFunctions: AuthFunctions = internal.auth;

export const authComponent = createClient<DataModel>(components.betterAuth, {
  authFunctions,
  triggers: {
    user: {
      onCreate: async (ctx, doc) => {
        const settings = await ctx.db
          .query("settings")
          .withIndex("by_userId", (q) => q.eq("userId", doc._id))
          .unique();

        if (settings) {
          console.log("Settings already exists for user:", doc._id);
          return;
        }

        console.log("Creating settings for user:", doc._id);
        await ctx.db.insert("settings", {
          userId: doc._id,
          mode: "dark",
          theme: "default",
          modelId: "mistral-small-latest",
          pinnedModels: ["magistral-small-latest", "mistral-small-latest"],
        });
      },
      onUpdate: async (_ctx, _newDoc, _oldDoc) => {
        await console.log("Updating settings for user:", _newDoc._id);
      },
      onDelete: async (ctx, doc) => {
        const settings = await ctx.db
          .query("settings")
          .withIndex("by_userId", (q) => q.eq("userId", doc._id))
          .unique();

        if (settings) {
          console.log("Deleting settings for user:", doc._id);
          await ctx.db.delete(settings._id);
        }
      },
    },
  },
});

export const createAuth = (
  ctx: GenericCtx<DataModel>,
  { optionsOnly } = { optionsOnly: false }
) =>
  betterAuth({
    logger: {
      disabled: optionsOnly,
    },
    baseURL: siteUrl,
    database: authComponent.adapter(ctx),
    socialProviders: {
      github: {
        clientId: process.env.GITHUB_CLIENT_ID as string,
        clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      },
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        accessType: "offline",
        prompt: "select_account consent",
      },
    },
    plugins: [
      convex(),
      magicLink({
        sendMagicLink: async ({ email, url }) => {
          await sendMagicLink(requireActionCtx(ctx), {
            to: email,
            url,
          });
        },
      }),
    ],
  });

/**
 * Retrieves the current authenticated user.
 *
 * @returns The current user or null if not authenticated
 */
export const getCurrentUser = query({
  handler: async (ctx) => authComponent.getAuthUser(ctx),
});

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
    } catch (error) {
      console.error("Error getting session:", error);
      return null;
    }
  },
});

export const { onCreate, onUpdate, onDelete } = authComponent.triggersApi();
