"use server";

import { fetchQuery, preloadQuery } from "convex/nextjs";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { ModelsProvider } from "@/components/providers/models-provider";
import { SessionsProvider } from "@/components/providers/sessions-provider";
import { SettingsProvider } from "@/components/providers/settings-provider";
import { UserProvider } from "@/components/providers/user-provider";
import { api } from "@/convex/_generated/api";
import { getToken } from "@/lib/auth-server";
import { loginPath } from "@/paths";

const ProtectedLayout = async ({ children }: { children: ReactNode }) => {
  const token = await getToken();

  if (!token) {
    redirect(loginPath());
  }

  const session = await fetchQuery(api.users.getSession, {}, { token });

  if (!session) {
    redirect(loginPath());
  }

  const [preloadedSettings, preloadedModels, preloadedSessions, preloadedUser] =
    await Promise.all([
      preloadQuery(api.settings.get, {}, { token }),
      preloadQuery(api.models.getAll, {}, { token }),
      preloadQuery(api.users.getAllSessions, {}, { token }),
      preloadQuery(api.auth.getCurrentUser, {}, { token }),
    ]);

  return (
    <UserProvider preloadedUser={preloadedUser}>
      <SettingsProvider preloadedSettings={preloadedSettings}>
        <ModelsProvider preloadedModels={preloadedModels}>
          <SessionsProvider preloadedSessions={preloadedSessions}>
            {children}
          </SessionsProvider>
        </ModelsProvider>
      </SettingsProvider>
    </UserProvider>
  );
};

export default ProtectedLayout;
