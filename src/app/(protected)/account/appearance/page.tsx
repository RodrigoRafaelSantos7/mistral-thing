"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { Activity, useEffect } from "react";
import { Section } from "@/components/ui/section";
import { Separator } from "@/components/ui/separator";
import { useUserSettings } from "@/lib/user-settings-store/provider";
import { cn } from "@/lib/utils";

const Page = () => {
  const { settings, updateSettings } = useUserSettings();
  const { setTheme } = useTheme();

  useEffect(() => {
    if (settings) {
      setTheme(`${settings.theme}-${settings.mode}`);
    }
  }, [settings, setTheme]);

  return (
    <div className="flex w-full flex-col gap-8">
      <Section description="Choose between light and dark mode" title="Mode">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <button
            className={cn(
              "relative w-full cursor-pointer rounded-lg border border-foreground/15 bg-muted/50 p-4 text-left backdrop-blur-md transition-all hover:border-foreground/20",
              settings.mode === "light"
                ? "border-primary/50 bg-primary/5"
                : "border-foreground/10 hover:bg-muted/50"
            )}
            onClick={() => {
              updateSettings({ mode: "light" });
            }}
            type="button"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted">
                <SunIcon className="size-4" />
              </div>
              <div className="flex-1">
                <div className="font-medium">Light Mode</div>
                <div className="text-muted-foreground text-sm">
                  Bright interface for daytime use
                </div>
              </div>
            </div>
            <Activity mode={settings.mode === "light" ? "visible" : "hidden"}>
              <div className="absolute top-2 right-2">
                <div className="size-2 rounded-full bg-primary" />
              </div>
            </Activity>
          </button>

          <button
            className={cn(
              "relative w-full cursor-pointer rounded-lg border border-foreground/15 bg-muted/50 p-4 text-left backdrop-blur-md transition-all hover:border-foreground/20",
              settings.mode === "dark"
                ? "border-primary/50 bg-primary/5"
                : "border-foreground/10 hover:bg-muted/50"
            )}
            onClick={() => {
              updateSettings({ mode: "dark" });
            }}
            type="button"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted">
                <MoonIcon className="size-4" />
              </div>
              <div className="flex-1">
                <div className="font-medium">Dark Mode</div>
                <div className="text-muted-foreground text-sm">
                  Dark interface for nighttime use
                </div>
              </div>
            </div>
            <Activity mode={settings.mode === "dark" ? "visible" : "hidden"}>
              <div className="absolute top-2 right-2">
                <div className="size-2 rounded-full bg-primary" />
              </div>
            </Activity>
          </button>
        </div>
      </Section>
      <Separator />
    </div>
  );
};

export default Page;
