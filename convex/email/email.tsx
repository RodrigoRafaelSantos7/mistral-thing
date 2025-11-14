import { Resend } from "@convex-dev/resend";
import { pretty, render } from "@react-email/components";
import { components } from "../_generated/api";
import type { ActionCtx } from "../_generated/server";
import { MagicLinkEmail } from "./template";

export const resend = new Resend(components.resend, {
  testMode: false,
});

export const sendMagicLink = async (
  ctx: ActionCtx,
  {
    to,
    url,
  }: {
    to: string;
    url: string;
  }
) => {
  const MagicLinkEmailHtml = await pretty(
    await render(<MagicLinkEmail magicLink={url} />)
  );

  return await resend.sendEmail(ctx, {
    from: "Mistral Thing <no-reply@mistral-thing.xyz>",
    to,
    subject: "Your Magic Link for Mistral Thing",
    html: MagicLinkEmailHtml,
  });
};
