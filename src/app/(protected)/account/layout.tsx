import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AccountLayout } from "@/modules/account/ui/layouts/account-layout";
import { AuthGuard } from "@/modules/auth/ui/components/auth-guard";

export const metadata: Metadata = {
  description: "Manage your account settings and preferences on Mistral Thing",
};

const Layout = async ({ children }: { children: ReactNode }) => (
  <AuthGuard>
    <AccountLayout>{children}</AccountLayout>
  </AuthGuard>
);

export default Layout;
