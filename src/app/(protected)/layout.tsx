import { preloadQuery } from "convex/nextjs";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { getToken } from "@/lib/auth/auth-server";
import { ModelsProvider } from "@/lib/models-store/provider";
import { loginPath } from "@/lib/paths";
import { UserSettingsProvider } from "@/lib/user-settings-store/provider";

export const metadata: Metadata = {
  title: {
    default: "What's on your mind?",
    template: "%s | Mistral Thing",
  },
};

const AuthLayout = async ({ children }: { children: React.ReactNode }) => {
  const token = await getToken();

  if (!token) {
    return redirect(loginPath());
  }

  const [initialSettings, initialModels] = await Promise.all([
    preloadQuery(api.settings.get, {}, { token }),
    preloadQuery(api.models.list, {}, { token }),
  ]);

  return (
    <UserSettingsProvider initialSettings={initialSettings}>
      <ModelsProvider initialModels={initialModels}>{children}</ModelsProvider>
    </UserSettingsProvider>
  );
};

export default AuthLayout;
