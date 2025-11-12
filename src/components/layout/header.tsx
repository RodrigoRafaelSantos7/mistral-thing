import { ModelSelector } from "@/components/app/model-selector";

import { SidebarTrigger } from "@/components/ui/sidebar";

import { cn } from "@/lib/utils";

// @todo: add threadId to the header
export function Header() {
  return (
    <div
      className={cn(
        "absolute top-0 right-0 left-0 z-10 flex justify-between border-foreground/10 bg-background/50 backdrop-blur-md"
      )}
    >
      <div className="flex items-center gap-2 p-3">
        <SidebarTrigger />
        <ModelSelector />
      </div>
      <div className="flex items-center gap-2 p-3" />
    </div>
  );
}
