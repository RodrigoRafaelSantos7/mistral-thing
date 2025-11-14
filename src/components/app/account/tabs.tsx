"use client";

import { BotIcon, PaintbrushIcon, SettingsIcon, UserIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  accountAppearancePath,
  accountModelsPath,
  accountPath,
  accountPreferencesPath,
} from "@/paths";

export const TabsItems = [
  {
    title: "Account",
    url: accountPath(),
    icon: UserIcon,
  },

  {
    title: "Preferences",
    url: accountPreferencesPath(),
    icon: SettingsIcon,
  },
  {
    title: "Models",
    url: accountModelsPath(),
    icon: BotIcon,
  },
  {
    title: "Appearance",
    url: accountAppearancePath(),
    icon: PaintbrushIcon,
  },
];

const Tabs = () => {
  const pathname = usePathname();

  return (
    <div className="w-0 min-w-full overflow-x-auto">
      <div className="flex flex-row gap-2">
        {TabsItems.map((page) => (
          <Button asChild key={page.url} variant="ghost">
            <Link
              className={cn(
                "flex items-center justify-start gap-2",
                pathname === page.url &&
                  "border border-foreground/10 bg-muted/50"
              )}
              href={page.url}
              prefetch
            >
              <page.icon className="size-4" />
              {page.title}
            </Link>
          </Button>
        ))}
      </div>
    </div>
  );
};

export { Tabs };
