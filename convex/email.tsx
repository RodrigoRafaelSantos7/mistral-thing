import { Resend } from "@convex-dev/resend";
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import { pretty, render } from "@react-email/render";
import { components } from "./_generated/api";
import type { ActionCtx } from "./_generated/server";

type MagicLinkEmailProps = {
  magicLink: string;
};
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

export const MagicLinkEmail = ({ magicLink }: MagicLinkEmailProps) => (
  <Html>
    <Head />
    <Tailwind>
      <Body className="bg-[#181825] font-sans">
        <Preview>Your Magic Link for Mistral Thing</Preview>
        <Container className="mx-auto my-0 max-w-[560px] px-4 pt-5 pb-12">
          <Img
            alt="Mistral Thing"
            className="h-[42px] w-[42px] rounded-3xl"
            height="42"
            src={"https://mistral-thing.xyz/icon-white.svg"}
            width="42"
          />
          <Heading className="px-0 pt-[17px] pb-0 font-normal font-sans text-[#cdd6f4] text-[24px] leading-[1.3] tracking-[-0.5px]">
            Your Magic Link for Mistral Thing
          </Heading>
          <Section className="px-0 py-[27px]">
            <Button
              className="block rounded bg-[#cba6f7] px-[23px] py-[11px] text-center font-semibold text-[#181825] text-[15px] no-underline"
              href={magicLink}
            >
              Login to Mistral Thing
            </Button>
          </Section>
          <Text className="mx-0 mt-0 mb-[15px] text-[#a6adc8] text-[15px] leading-[1.4]">
            This link will only be valid for the next 5 minutes. If the link
            does not work, you can click
            <Link className="text-[#cba6f7] text-[14px]" href={magicLink}>
              {" "}
              here directly
            </Link>
          </Text>

          <Hr className="mt-[42px] mb-[26px] border-[#cba6f7]" />
          <Link
            className="text-[#b4becc] text-[14px]"
            href="https://mistral-thing.xyz"
          >
            Mistral Thing
          </Link>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

MagicLinkEmail.PreviewProps = {
  magicLink: "https://mistral-thing.xyz/magic-link",
} as MagicLinkEmailProps;

export default MagicLinkEmail;
