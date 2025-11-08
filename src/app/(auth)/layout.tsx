import { fetchQuery } from "convex/nextjs";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { getToken } from "@/lib/auth-server";
import { AuthLayout } from "@/modules/auth/ui/layouts/auth-layout";
import { indexPath } from "@/paths";

export const metadata: Metadata = {
  description:
    "Get access to AI models from Mistral. Nearly unlimited tier is free!",
};

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const session = await (async () => {
    "use server";
    const token = await getToken();
    return await fetchQuery(api.users.getSession, {}, { token });
  })();

  if (session) {
    return redirect(indexPath());
  }

  return <AuthLayout>{children}</AuthLayout>;
};

export default Layout;
