"use client";

import { Section } from "@/components/ui/section";
import { Separator } from "@/components/ui/separator";
import { useSettings } from "@/hooks/use-database";
import { NicknameForm } from "@/modules/account/ui/components/nickname-form";
import { InstructionsForm } from "../components/instructions-form";

const PreferencesView = () => {
  const { settings } = useSettings();

  if (!settings) {
    return null;
  }

  return (
    <div className="flex flex-col gap-8">
      <Section
        description="Customize your preferences here."
        title="Preferences"
      >
        <NicknameForm defaultValue={settings.nickname ?? ""} />
      </Section>

      <Separator />

      <Section description="Customize your system prompt here." title="System">
        <InstructionsForm defaultValue={settings.instructions ?? ""} />
      </Section>
    </div>
  );
};

export { PreferencesView };
