"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ACCOUNT_PAGES } from "@/config/accont-pages";
import { cn } from "@/lib/utils";

const AccountTabs = () => {
  const pathname = usePathname();

  return (
    <div className="w-0 min-w-full overflow-x-auto">
      <div className="flex flex-row gap-2">
        {ACCOUNT_PAGES.map((page) => (
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

export { AccountTabs };
