"use client";

import { toast } from "sonner";
import { z } from "zod";
import { SingleFieldForm } from "@/components/app/single-field-form";
import { Input } from "@/components/ui/input";
import { Section } from "@/components/ui/section";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useUserSettings } from "@/lib/user-settings-store/provider";

const MIN_NICKNAME_LENGTH = 0;
const MAX_NICKNAME_LENGTH = 50;

const nicknameSchema = z.object({
  value: z
    .string()
    .min(MIN_NICKNAME_LENGTH, {
      message: `Nickname must be at least ${MIN_NICKNAME_LENGTH} characters`,
    })
    .max(MAX_NICKNAME_LENGTH, {
      message: `Nickname must be at most ${MAX_NICKNAME_LENGTH} characters`,
    }),
});

const MIN_BIOGRAPHY_LENGTH = 0;
const MAX_BIOGRAPHY_LENGTH = 500;

const biographySchema = z.object({
  value: z
    .string()
    .min(MIN_BIOGRAPHY_LENGTH, {
      message: `Biography must be at least ${MIN_BIOGRAPHY_LENGTH} characters`,
    })
    .max(MAX_BIOGRAPHY_LENGTH, {
      message: `Biography must be at most ${MAX_BIOGRAPHY_LENGTH} characters`,
    }),
});

const MIN_INSTRUCTIONS_LENGTH = 0;
const MAX_INSTRUCTIONS_LENGTH = 1000;

const instructionsSchema = z.object({
  value: z
    .string()
    .min(MIN_INSTRUCTIONS_LENGTH, {
      message: `Instructions must be at least ${MIN_INSTRUCTIONS_LENGTH} characters`,
    })
    .max(MAX_INSTRUCTIONS_LENGTH, {
      message: `Instructions must be at most ${MAX_INSTRUCTIONS_LENGTH} characters`,
    }),
});

const Page = () => {
  const { settings, updateSettings } = useUserSettings();
  return (
    <div className="flex flex-col gap-8">
      <Section
        description="Customize your preferences here."
        title="Preferences"
      >
        <SingleFieldForm
          defaultValue={settings.nickname ?? ""}
          description="What do you want Mistral Thing to call you?"
          footerMessage="Please use 50 characters or less."
          label="Nickname"
          onSubmit={async (value) => {
            updateSettings({ nickname: value });
            toast.success("Nickname saved");
          }}
          renderInput={({ onChange, value }) => (
            <Input
              className="border border-foreground/15 bg-muted/50 backdrop-blur-md"
              onChange={(e) => onChange(e.target.value)}
              placeholder="Enter your nickname"
              value={value}
            />
          )}
          schema={nicknameSchema}
        />
        <SingleFieldForm
          defaultValue={settings?.biography ?? ""}
          description="What should Mistral Thing Chat know about you?"
          footerMessage="Please use 500 characters or less."
          label="Biography"
          onSubmit={async (value) => {
            updateSettings({ biography: value });
            toast.success("Biography saved");
          }}
          renderInput={({ onChange, value }) => (
            <Textarea
              className="resize-none border border-foreground/15 bg-muted/50 backdrop-blur-md"
              onChange={(e) => onChange(e.target.value)}
              placeholder="Enter your biography"
              rows={5}
              value={value}
            />
          )}
          schema={biographySchema}
        />
      </Section>
      <Separator />
      <Section description="Customize your system prompt here." title="System">
        <SingleFieldForm
          defaultValue={settings.instructions ?? ""}
          description="How do you want Mistral Thing to behave?"
          footerMessage={`Please use ${MAX_INSTRUCTIONS_LENGTH} characters or less.`}
          label="Instructions"
          onSubmit={async (value) => {
            updateSettings({ instructions: value });
            toast.success("Instructions saved");
          }}
          renderInput={({ onChange, value }) => (
            <Textarea
              className="resize-none border border-foreground/15 bg-muted/50 backdrop-blur-md"
              onChange={(e) => onChange(e.target.value)}
              placeholder="Enter your instructions"
              rows={5}
              value={value}
            />
          )}
          schema={instructionsSchema}
        />
      </Section>
    </div>
  );
};

export default Page;
