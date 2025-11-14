"use client";

import { SingleFieldForm } from "@/components/single-field-form";
import { Input } from "@/components/ui/input";
import { Section } from "@/components/ui/section";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  biographySchema,
  instructionsSchema,
  MAX_BIOGRAPHY_LENGTH,
  MAX_INSTRUCTIONS_LENGTH,
  MAX_NICKNAME_LENGTH,
  nicknameSchema,
} from "@/lib/schemas/preferences";
import { useUserSettings } from "@/lib/user-settings-store/provider";

const PreferencesPage = () => {
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
          footerMessage={`Please use ${MAX_NICKNAME_LENGTH} characters or less.`}
          label="Nickname"
          onSubmit={async (value) => {
            updateSettings({ nickname: value });
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
          defaultValue={settings.biography ?? ""}
          description="What should Mistral Thing Chat know about you?"
          footerMessage={`Please use ${MAX_BIOGRAPHY_LENGTH} characters or less.`}
          label="Biography"
          onSubmit={async (value) => {
            updateSettings({ biography: value });
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

export default PreferencesPage;
