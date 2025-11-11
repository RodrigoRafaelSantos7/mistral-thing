"use client";

import { ModelSelector } from "@/components/app/model-selector";
import { ThemeSelector } from "@/components/app/theme-selector";
import { UserMenu } from "@/components/app/user-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";

import { useParamsThreadId } from "@/hooks/use-params-thread-id";
import { cn } from "@/lib/utils";

export function Header() {
  const threadId = useParamsThreadId();

  return (
    <div
      className={cn(
        threadId && "border-b",
        "absolute top-0 right-0 left-0 z-10 flex justify-between border-foreground/10 bg-background/50 backdrop-blur-md"
      )}
    >
      <div className="flex items-center gap-2 p-3">
        <SidebarTrigger />
        <ModelSelector />
      </div>
      <div className="flex items-center gap-2 p-3">
        <ThemeSelector />
        <UserMenu />
      </div>
    </div>
  );
}
