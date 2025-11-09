"use client";

import { useTheme } from "next-themes";
import { useEffect } from "react";
import { Section } from "@/components/ui/section";
import { Separator } from "@/components/ui/separator";
import { useSettings } from "@/hooks/use-database";
import { ModeToggle } from "@/modules/account/ui/components/mode-toggle";
import { ThemeToggle } from "@/modules/account/ui/components/theme-toggle";

const AppearanceView = () => {
  const { settings } = useSettings();
  const { setTheme } = useTheme();

  useEffect(() => {
    if (settings) {
      setTheme(`${settings.theme}-${settings.mode}`);
    }
  }, [settings, setTheme]);

  if (!settings) {
    return null;
  }

  return (
    <div className="flex w-full flex-col gap-8">
      <Section description="Choose between light and dark mode" title="Mode">
        <ModeToggle mode={settings.mode} />
      </Section>
      <Separator />
      <Section description="Choose your preferred visual theme" title="Theme">
        <ThemeToggle mode={settings.mode} theme={settings.theme} />
      </Section>
    </div>
  );
};

export { AppearanceView };
