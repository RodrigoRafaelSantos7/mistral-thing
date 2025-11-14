import { createClient, type GenericCtx } from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import { requireActionCtx } from "@convex-dev/better-auth/utils";
import { betterAuth } from "better-auth";
import { magicLink } from "better-auth/plugins";
import { components, internal } from "./_generated/api";
import type { DataModel } from "./_generated/dataModel";

const siteUrl = process.env.SITE_URL as string;

export const authComponent = createClient<DataModel>(components.betterAuth);

export const createAuth = (
  ctx: GenericCtx<DataModel>,
  { optionsOnly } = { optionsOnly: false }
) =>
  betterAuth({
    logger: {
      disabled: optionsOnly,
    },
    trustedOrigins: [
      "https://mistral-thing.xyz",
      "https://www.mistral-thing.xyz",
      "http://localhost:3000",
    ],
    session: {
      expiresIn: 60 * 60 * 24 * 7,
      updateAge: 60 * 60 * 24,
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
          await requireActionCtx(ctx).runAction(internal.email.sendMagicLink, {
            to: email,
            url,
          });
        },
      }),
    ],
  });
