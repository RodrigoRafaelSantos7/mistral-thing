import {
  type AuthFunctions,
  createClient,
  type GenericCtx,
} from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import { requireActionCtx } from "@convex-dev/better-auth/utils";
import { betterAuth } from "better-auth";
import { magicLink } from "better-auth/plugins";
import { components, internal } from "./_generated/api";
import type { DataModel } from "./_generated/dataModel";
import { query } from "./_generated/server";
import { sendMagicLink } from "./emails";

const siteUrl = process.env.SITE_URL
  ? process.env.SITE_URL
  : "http://localhost:3000";

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
          return;
        }

        await ctx.db.insert("settings", {
          userId: doc._id,
          mode: "dark",
          theme: "default",
          modelId: "mistral-small-latest",
          pinnedModels: [
            "mistral-medium-latest",
            "codestral-latest",
            "mistral-small-latest",
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

export const getCurrentUser = query({
  handler: async (ctx) => authComponent.getAuthUser(ctx),
});

export const { onCreate, onUpdate, onDelete } = authComponent.triggersApi();
