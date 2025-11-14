import { fetchQuery } from "convex/nextjs";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { getToken } from "@/lib/auth-server";
import { indexPath } from "@/paths";

export const metadata: Metadata = {
  title: {
    default: "Welcome Back",
    template: "%s | Mistral Thing",
  },
  description:
    "Get access to AI models from Mistral. Nearly unlimited tier is free!",
};

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const token = await getToken();

  if (token) {
    const session = await fetchQuery(api.auth.getSession, {}, { token });
    if (session) {
      return redirect(indexPath());
    }
  }

  return (
    <div className="flex h-full min-h-screen min-w-screen flex-col items-center justify-center">
      {children}
    </div>
  );
};

export default Layout;
