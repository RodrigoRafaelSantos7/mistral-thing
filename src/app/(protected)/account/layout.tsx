import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AccountLayout } from "@/modules/account/ui/layouts/account-layout";

export const metadata: Metadata = {
  description: "Manage your account settings and preferences on Mistral Thing",
};

const Layout = async ({ children }: { children: ReactNode }) => (
  <AccountLayout>{children}</AccountLayout>
);

export default Layout;
