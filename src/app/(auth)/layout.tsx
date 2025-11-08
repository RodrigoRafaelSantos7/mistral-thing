import type { Metadata } from "next";
import { SITE_CONFIG } from "@/config/site";
import { AuthLayout } from "@/modules/auth/ui/layouts/auth-layout";

export const metadata: Metadata = {
  title: {
    default: SITE_CONFIG.name,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description:
    "Get access to AI models from Mistral. Nearly unlimited tier is free!",
};

const Layout = ({ children }: { children: React.ReactNode }) => (
  <AuthLayout>{children}</AuthLayout>
);

export default Layout;
