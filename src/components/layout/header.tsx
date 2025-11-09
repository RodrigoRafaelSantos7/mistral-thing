import { ThemeSelector } from "@/components/app/theme-selector";
import { UserMenu } from "@/components/app/user-menu";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export function Header() {
  return (
    <div
      className={cn(
        "absolute top-0 right-0 left-0 z-10 flex justify-between border-foreground/10 bg-background/50 backdrop-blur-md"
      )}
    >
      <div className="flex items-center gap-2 p-3">
        <Tooltip>
          <TooltipTrigger asChild>
            <SidebarTrigger />
          </TooltipTrigger>
          <TooltipContent>
            <KbdGroup>
              <Kbd>Ctrl</Kbd>
              <span>+</span>
              <Kbd>B</Kbd>
            </KbdGroup>
          </TooltipContent>
        </Tooltip>
      </div>
      <div className="flex items-center gap-2 p-3">
        <ThemeSelector />
        <UserMenu />
      </div>
    </div>
  );
}
