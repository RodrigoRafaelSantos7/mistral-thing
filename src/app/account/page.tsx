import {
  BotIcon,
  CreditCardIcon,
  PaintbrushIcon,
  SettingsIcon,
  UserIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Anonymous } from "@/components/app/auth";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  accountAppearancePath,
  accountModelsPath,
  accountPath,
  accountPreferencesPath,
  accountSubscriptionPath,
  loginPath,
} from "@/paths";

const pages = [
  {
    title: "Account",
    url: accountPath(),
    icon: <UserIcon />,
  },
  {
    title: "Subscription",
    url: accountSubscriptionPath(),
    icon: <CreditCardIcon />,
  },
  {
    title: "Preferences",
    url: accountPreferencesPath(),
    icon: <SettingsIcon />,
  },
  {
    title: "Models",
    url: accountModelsPath(),
    icon: <BotIcon />,
  },
  {
    title: "Appearance",
    url: accountAppearancePath(),
    icon: <PaintbrushIcon />,
  },
];

const Page = () => {
  const pathname = usePathname();
  return (
    <div className="flex flex-1 py-24">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <div>
          <h1 className="font-bold text-2xl">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account preferences and configuration.
          </p>
        </div>
        <div className="w-0 min-w-full overflow-x-auto">
          <div className="flex flex-row gap-2">
            {pages.map((page) => (
              <Button asChild key={page.url} variant="ghost">
                <Link
                  className={cn(
                    "flex items-center justify-start gap-2",
                    // TODO: Check if this is working properly
                    pathname === page.url &&
                      "border border-foreground/10 bg-muted/50"
                  )}
                  href={page.url}
                  prefetch
                >
                  {page.icon}
                  {page.title}
                </Link>
              </Button>
            ))}
          </div>
        </div>
        <div className="flex-1">
          <Anonymous>
            <Section
              description="As an anonymous user, your data may be deleted or lost at any time. Login to keep your data safe."
              title="Anonymous"
            >
              <div className="mb-8 flex flex-col overflow-hidden rounded-lg border bg-card p-0 text-muted-foreground text-sm backdrop-blur-md">
                <div className="flex flex-col gap-2 p-4">
                  <h3>Not logged in</h3>
                  <p>
                    You are currently an anonymous user. Your chats, messages
                    and preferences may be deleted in the future. To save your
                    data, create an account or login.
                  </p>
                </div>
                <div className="flex w-full justify-end border-t bg-sidebar px-4 py-3">
                  <Button asChild size="sm" variant="default">
                    <Link href={loginPath()}>Login</Link>
                  </Button>
                </div>
              </div>
            </Section>
            <Separator className="mb-8" />
          </Anonymous>
        </div>
      </div>
    </div>
  );
};

export default Page;
