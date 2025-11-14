"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { Activity, useEffect } from "react";
import { Section } from "@/components/ui/section";
import { Separator } from "@/components/ui/separator";
import { THEMES } from "@/lib/config";
import { useUserSettings } from "@/lib/user-settings-store/provider";
import { cn } from "@/lib/utils";

const Page = () => {
  const { settings, updateSettings } = useUserSettings();
  const { setTheme } = useTheme();

  useEffect(() => {
    setTheme(`${settings.theme}-${settings.mode}`);
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
      <Section description="Choose your preferred visual theme" title="Theme">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {THEMES.map((themeOption) => (
            <button
              className={cn(
                "relative w-full cursor-pointer overflow-hidden rounded-lg border bg-background/10 p-4 text-left backdrop-blur-md transition-all hover:border-foreground/20",
                themeOption.value === settings.theme
                  ? "border-primary/50 bg-primary/5"
                  : "border-foreground/10 hover:bg-muted/50"
              )}
              key={themeOption.value}
              onClick={() => {
                updateSettings({ theme: themeOption.value });
              }}
              type="button"
            >
              <div className="mb-3 flex items-center gap-3">
                <div className="flex-1">
                  <div className="font-medium text-sm">{themeOption.name}</div>
                  <div className="text-muted-foreground text-xs">
                    {themeOption.description}
                  </div>
                </div>
              </div>
              <Activity
                mode={
                  themeOption.value === settings.theme ? "visible" : "hidden"
                }
              >
                <div className="absolute top-2 right-2">
                  <div className="size-2 rounded-full bg-primary" />
                </div>
              </Activity>
              <div className="absolute right-0 bottom-0 left-0 flex">
                <div
                  className={cn(
                    themeOption.value,
                    settings.mode,
                    "size-4 flex-1 bg-primary"
                  )}
                />
                <div
                  className={cn(
                    themeOption.value,
                    settings.mode,
                    "size-4 flex-1 bg-secondary"
                  )}
                />
                <div
                  className={cn(
                    themeOption.value,
                    settings.mode,
                    "size-4 flex-1 bg-accent"
                  )}
                />
              </div>
            </button>
          ))}
        </div>
      </Section>
    </div>
  );
};

export default Page;
