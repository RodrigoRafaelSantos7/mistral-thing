import { preloadQuery } from "convex/nextjs";
import type { ReactNode } from "react";
import { api } from "@/convex/_generated/api";
import { getToken } from "@/lib/auth-server";
import { ModelsProvider } from "@/lib/model-store/provider";
import { UserSettingsProvider } from "@/lib/user-settings-store/provider";
import { UserProvider } from "@/lib/user-store/provider";

const DatabaseProvider = async ({ children }: { children: ReactNode }) => {
  const token = await getToken();

  const [initialSettings, initialModels, initialUser] = await Promise.all([
    preloadQuery(api.settings.get, {}, { token }),
    preloadQuery(api.models.list, {}, { token }),
    preloadQuery(api.users.get, {}, { token }),
  ]);

  return (
    <UserSettingsProvider initialSettings={initialSettings}>
      <ModelsProvider initialModels={initialModels}>
        <UserProvider initialUser={initialUser}>{children}</UserProvider>
      </ModelsProvider>
    </UserSettingsProvider>
  );
};
export { DatabaseProvider };
