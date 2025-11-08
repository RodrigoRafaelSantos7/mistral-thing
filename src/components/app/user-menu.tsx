"use client";

import {
  BotIcon,
  GithubIcon,
  LogOutIcon,
  PaintbrushIcon,
  SettingsIcon,
  UserIcon,
} from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { SITE_CONFIG } from "@/config/site";
import { useAuth } from "@/hooks/use-auth";
import { useUser } from "@/hooks/use-database";
import { getUsername } from "@/lib/usernames";
import {
  accountAppearancePath,
  accountModelsPath,
  accountPath,
  accountPreferencesPath,
} from "@/paths";

export function UserMenu() {
  const user = useUser();
  const { handleSignOut } = useAuth();

  if (!user) {
    return <Skeleton className="size-9" />;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="cursor-pointer outline-none">
        <Button asChild size="icon" variant="ghost">
          <Avatar className="overflow-hidden rounded-md">
            <AvatarImage
              className="rounded-none"
              src={user.image ?? undefined}
            />
            <AvatarFallback className="rounded-none">
              {getUsername({
                id: user._id,
                name: user.name,
              }).charAt(0)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-[200px] border-foreground/10 bg-background/50 backdrop-blur-md"
      >
        <DropdownMenuLabel className="flex items-center gap-2">
          <div className="flex flex-col overflow-hidden">
            <div className="truncate text-sm">
              {getUsername({ id: user._id, name: user.name })}
            </div>
            <div className="truncate text-muted-foreground text-xs">
              {user.email}
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={accountPath()}>
            <UserIcon className="size-4" />
            Account
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={accountPreferencesPath()}>
            <SettingsIcon className="size-4" />
            Preferences
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={accountModelsPath()}>
            <BotIcon className="size-4" />
            Models
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={accountAppearancePath()}>
            <PaintbrushIcon className="size-4" />
            Appearance
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link
            href={SITE_CONFIG.links.github}
            rel="noreferrer"
            target="_blank"
          >
            <GithubIcon className="size-4" />
            GitHub
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOutIcon className="size-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
