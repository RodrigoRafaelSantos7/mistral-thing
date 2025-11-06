import Link from "next/link";
import type { ReactNode } from "react";
import { AccountTabs } from "@/components/app/account-tabs";
import { Anonymous } from "@/components/app/auth";
import { buttonVariants } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { Separator } from "@/components/ui/separator";
import { loginPath } from "@/paths";

const Layout = ({ children }: { children: ReactNode }) => (
  <div className="flex flex-1 py-24">
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
      <div>
        <h1 className="font-bold text-2xl">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account preferences and configuration.
        </p>
      </div>
      <AccountTabs />
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
                  You are currently an anonymous user. Your chats, messages and
                  preferences may be deleted in the future. To save your data,
                  create an account or login.
                </p>
              </div>
              <div className="flex w-full justify-end border-t bg-sidebar px-4 py-3">
                <Link
                  className={buttonVariants({
                    size: "sm",
                    variant: "default",
                  })}
                  href={loginPath()}
                  prefetch
                >
                  Login
                </Link>
              </div>
            </div>
          </Section>
          <Separator className="mb-8" />
        </Anonymous>
        {children}
      </div>
    </div>
  </div>
);

export default Layout;
