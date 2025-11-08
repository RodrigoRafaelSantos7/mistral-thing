"use client";

import { MoonIcon, PaintBucket, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { THEMES } from "@/config/themes";
import { useSettings } from "@/hooks/use-database";
import { cn } from "@/lib/utils";

export function ThemeSelector() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const { settings, updateSettings } = useSettings();
  const { setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (settings) {
      setTheme(`${settings.theme}-${settings.mode}`);
    }
  }, [settings, setTheme]);

  if (!(mounted && settings)) {
    return <Skeleton className="size-9" />;
  }

  const mode = settings.mode ?? "dark";
  const currentTheme = settings.theme ?? "default";

  return (
    <Tooltip>
      <Popover onOpenChange={setOpen} open={open}>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <Button aria-expanded={open} size="icon" variant="outline">
              <PaintBucket className="size-4" />
            </Button>
          </PopoverTrigger>
        </TooltipTrigger>
        <PopoverContent
          align="end"
          className="w-[250px] overflow-hidden border-foreground/10 bg-background/50 p-0 backdrop-blur-md"
        >
          <Command>
            <CommandInput className="h-9" placeholder="Search theme..." />
            <CommandList>
              <CommandEmpty>No theme found.</CommandEmpty>
              <CommandGroup heading="Mode">
                <CommandItem
                  className="data-[selected=true]:bg-foreground/10 data-[selected=true]:text-foreground"
                  onSelect={() => {
                    updateSettings({
                      mode: "light",
                    });
                  }}
                  value="light"
                >
                  <SunIcon className="size-4" />
                  <span>Light</span>
                  <div className="flex-1" />
                  {mode === "light" && (
                    <span className="text-muted-foreground text-xs">
                      Selected
                    </span>
                  )}
                </CommandItem>
                <CommandItem
                  className="data-[selected=true]:bg-foreground/10 data-[selected=true]:text-foreground"
                  onSelect={() => {
                    updateSettings({
                      mode: "dark",
                    });
                  }}
                  value="dark"
                >
                  <MoonIcon className="size-4" />
                  <span>Dark</span>
                  <div className="flex-1" />
                  {mode === "dark" && (
                    <span className="text-muted-foreground text-xs">
                      Selected
                    </span>
                  )}
                </CommandItem>
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup heading="Theme">
                {THEMES.map((themeOption) => (
                  <CommandItem
                    className="data-[selected=true]:bg-foreground/10 data-[selected=true]:text-foreground"
                    key={themeOption.value}
                    onSelect={() => {
                      updateSettings({
                        theme: themeOption.value,
                      });
                    }}
                    value={themeOption.name}
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <div
                          className={cn(
                            themeOption.value,
                            mode,
                            "size-3 rounded-[3px] bg-primary"
                          )}
                        />
                        <div
                          className={cn(
                            themeOption.value,
                            mode,
                            "size-3 rounded-[3px] bg-secondary"
                          )}
                        />
                        <div
                          className={cn(
                            themeOption.value,
                            mode,
                            "size-3 rounded-[3px] bg-accent"
                          )}
                        />
                      </div>
                      <span>{themeOption.name}</span>
                    </div>
                    <div className="flex-1" />
                    {themeOption.value === currentTheme && (
                      <span className="text-muted-foreground text-xs">
                        Selected
                      </span>
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <TooltipContent>
        <p>Theme switcher</p>
      </TooltipContent>
    </Tooltip>
  );
}
