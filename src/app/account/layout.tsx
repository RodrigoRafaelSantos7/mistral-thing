import type { ReactNode } from "react";
import { AccountLayout } from "@/modules/account/ui/layouts/account-layout";
import { AuthGuard } from "@/modules/auth/ui/components/auth-guard";

const Layout = ({ children }: { children: ReactNode }) => (
  <AuthGuard>
    <AccountLayout>{children}</AccountLayout>
  </AuthGuard>
);

export default Layout;
