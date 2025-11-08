import {
  type AuthFunctions,
  createClient,
  type GenericCtx,
} from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import { requireActionCtx } from "@convex-dev/better-auth/utils";
import { betterAuth } from "better-auth";
import { anonymous, magicLink } from "better-auth/plugins";
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

const ONE_HOUR_SECONDS = 60 * 60;
const DAYS_IN_YEAR = 365;
const HOURS_IN_DAY = 24;
const ONE_YEAR = ONE_HOUR_SECONDS * HOURS_IN_DAY * DAYS_IN_YEAR;
const ONE_DAY = ONE_HOUR_SECONDS * HOURS_IN_DAY;

export const createAuth = (
  ctx: GenericCtx<DataModel>,
  { optionsOnly } = { optionsOnly: false }
) => {
  return betterAuth({
    // disable logging when createAuth is called just to generate options.
    // this is not required, but there's a lot of noise in logs without it.
    logger: {
      disabled: optionsOnly,
    },
    session: {
      expiresIn: ONE_YEAR,
      updateAge: ONE_DAY,
    },
    baseURL: siteUrl,
    database: authComponent.adapter(ctx),
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
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
      anonymous({
        disableDeleteAnonymousUser: true,
        onLinkAccount: async ({ anonymousUser, newUser }) => {
          // Need to delete the anonymous user after linking
          // There is a bug with the anonymous user
          // biome-ignore lint/suspicious/noConsole: Temporary
          await console.log({ anonymousUser, newUser });
        },
      }),
    ],
  });
};

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => authComponent.getAuthUser(ctx),
});

export const { onCreate, onUpdate, onDelete } = authComponent.triggersApi();
