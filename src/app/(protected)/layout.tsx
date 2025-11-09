import { preloadQuery } from "convex/nextjs";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { api } from "@/convex/_generated/api";
import { getToken } from "@/lib/auth-server";
import { ModelsProvider } from "@/modules/account/providers/models-provider";
import { SessionsProvider } from "@/modules/account/providers/sessions-provider";
import { SettingsProvider } from "@/modules/account/providers/settings-provider";
import { loginPath } from "@/paths";

const ProtectedLayout = async ({ children }: { children: ReactNode }) => {
  const token = await getToken();

  if (!token) {
    return redirect(loginPath());
  }

  const [preloadedSettings, preloadedModels, preloadedSessions] =
    await Promise.all([
      preloadQuery(api.settings.get, {}, { token }),
      preloadQuery(api.models.getAll, {}, { token }),
      preloadQuery(api.users.getAllSessions, {}, { token }),
    ]);

  return (
    <SettingsProvider preloadedSettings={preloadedSettings}>
      <ModelsProvider preloadedModels={preloadedModels}>
        <SessionsProvider preloadedSessions={preloadedSessions}>
          {children}
        </SessionsProvider>
      </ModelsProvider>
    </SettingsProvider>
  );
};

export default ProtectedLayout;
