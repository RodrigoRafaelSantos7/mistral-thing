import {
  type AuthFunctions,
  createClient,
  type GenericCtx,
} from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import { requireActionCtx } from "@convex-dev/better-auth/utils";
import { betterAuth } from "better-auth";
import { magicLink } from "better-auth/plugins";
import { ConvexError } from "convex/values";
import { components, internal } from "./_generated/api";
import type { DataModel } from "./_generated/dataModel";
import { query } from "./_generated/server";
import { sendMagicLink } from "./emails";

const siteUrl = process.env.SITE_URL
  ? process.env.SITE_URL
  : "http://localhost:3000";

const authFunctions: AuthFunctions = internal.auth;

/**
 * Gets a required environment variable, throwing a clear error if missing.
 * This ensures fail-fast behavior with descriptive error messages.
 */
function getRequiredEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new ConvexError({
      code: 500,
      message: `Missing required environment variable: ${name}. Please set ${name} in your environment configuration.`,
      severity: "high",
    });
  }
  return value;
}

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
          return;
        }

        await ctx.db.insert("settings", {
          userId: doc._id,
          mode: "dark",
          theme: "default",
          modelId: "mistral-small-latest",
          pinnedModels: [
            "magistral-small-latest",
            "devstral-small-latest",
            "mistral-small-latest",
            "open-mistral-nemo",
          ],
        });
      },
      onDelete: async (ctx, doc) => {
        const settings = await ctx.db
          .query("settings")
          .withIndex("by_userId", (q) => q.eq("userId", doc._id))
          .unique();

        if (settings) {
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
        clientId: getRequiredEnvVar("GITHUB_CLIENT_ID"),
        clientSecret: getRequiredEnvVar("GITHUB_CLIENT_SECRET"),
      },
      google: {
        clientId: getRequiredEnvVar("GOOGLE_CLIENT_ID"),
        clientSecret: getRequiredEnvVar("GOOGLE_CLIENT_SECRET"),
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

export const getCurrentUser = query({
  handler: async (ctx) => authComponent.getAuthUser(ctx),
});

export const { onCreate, onUpdate, onDelete } = authComponent.triggersApi();
