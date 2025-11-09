import { AccountTabs } from "@/modules/account/ui/components/account-tabs";
import { BackButton } from "@/modules/account/ui/components/back-button";

const AccountLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="relative flex flex-1">
    <div className="relative z-1 flex min-h-screen flex-1 overflow-auto">
      <BackButton />
      <div className="w-full p-4">
        <div className="flex flex-1 py-24">
          <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
            <div>
              <h1 className="font-bold text-2xl">Settings</h1>
              <p className="text-muted-foreground">
                Manage your account preferences and configuration.
              </p>
            </div>
            <AccountTabs />
            <div className="flex-1">{children}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export { AccountLayout };
