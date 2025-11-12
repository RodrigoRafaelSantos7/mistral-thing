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
import { useRouter } from "next/navigation";
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
import { authClient } from "@/lib/auth-client";
import { GITHUB_URL } from "@/lib/config";
import { useUser } from "@/lib/user-store/provider";
import {
  accountAppearancePath,
  accountModelsPath,
  accountPath,
  accountPreferencesPath,
  loginPath,
} from "@/paths";

const UserMenu = () => {
  const { user } = useUser();
  const router = useRouter();

  if (!user) {
    return null;
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
              {user.email?.charAt(0)}
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
              {user.name ? user.name : user.email}
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
          <Link href={GITHUB_URL} rel="noreferrer" target="_blank">
            <GithubIcon className="size-4" />
            GitHub
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={async () =>
            await authClient.signOut().then(() => router.push(loginPath()))
          }
        >
          <LogOutIcon className="size-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export { UserMenu };
