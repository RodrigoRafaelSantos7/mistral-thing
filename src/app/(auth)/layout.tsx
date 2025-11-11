import type { Metadata } from "next";

export const metadata: Metadata = {
  description:
    "Get access to AI models from Mistral. Nearly unlimited tier is free!",
};

const Layout = async ({ children }: { children: React.ReactNode }) => (
  <>{children}</>
);

export default Layout;
