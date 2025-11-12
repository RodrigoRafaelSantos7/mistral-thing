import { fetchQuery } from "convex/nextjs";
import type { ReactNode } from "react";
import { api } from "@/convex/_generated/api";
import { getToken } from "@/lib/auth-server";
import { ModelsProvider } from "@/lib/model-store/provider";
import { UserSettingsProvider } from "@/lib/user-settings-store/provider";

const DatabaseProvider = async ({ children }: { children: ReactNode }) => {
  const token = await getToken();
  const initialSettings = await fetchQuery(api.settings.get, {}, { token });

  return (
    <UserSettingsProvider initialSettings={initialSettings}>
      <ModelsProvider>{children}</ModelsProvider>
    </UserSettingsProvider>
  );
};
export { DatabaseProvider };
