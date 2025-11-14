import { preloadQuery } from "convex/nextjs";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { getToken } from "@/lib/auth/auth-server";
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

  const [initialSettings] = await Promise.all([
    preloadQuery(api.settings.get, {}, { token }),
  ]);

  return (
    <UserSettingsProvider initialSettings={initialSettings}>
      {children}
    </UserSettingsProvider>
  );
};

export default AuthLayout;
