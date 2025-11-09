import { preloadQuery } from "convex/nextjs";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { api } from "@/convex/_generated/api";
import { getToken } from "@/lib/auth-server";
import { ModelsProvider } from "@/modules/account/providers/models-provider";
import { SessionsProvider } from "@/modules/account/providers/sessions-provider";
import { SettingsProvider } from "@/modules/account/providers/settings-provider";
import { AccountLayout } from "@/modules/account/ui/layouts/account-layout";
import { AuthGuard } from "@/modules/auth/ui/components/auth-guard";

export const metadata: Metadata = {
  description: "Manage your account settings and preferences on Mistral Thing",
};

const Layout = async ({ children }: { children: ReactNode }) => {
  const token = await getToken();
  const [preloadedSettings, preloadedModels, preloadedSessions] =
    await Promise.all([
      preloadQuery(api.settings.get, {}, { token }),
      preloadQuery(api.models.getAll, {}, { token }),
      preloadQuery(api.users.getAllSessions, {}, { token }),
    ]);

  return (
    <AuthGuard>
      <AccountLayout>
        <SettingsProvider preloadedSettings={preloadedSettings}>
          <ModelsProvider preloadedModels={preloadedModels}>
            <SessionsProvider preloadedSessions={preloadedSessions}>
              {children}
            </SessionsProvider>
          </ModelsProvider>
        </SettingsProvider>
      </AccountLayout>
    </AuthGuard>
  );
};

export default Layout;
