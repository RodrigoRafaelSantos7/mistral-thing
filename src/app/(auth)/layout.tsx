import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getToken } from "@/lib/auth/auth-server";
import { indexPath } from "@/lib/paths";

export const metadata: Metadata = {
  title: {
    default: "Welcome",
    template: "%s | Mistral Thing",
  },
  description:
    "Get access to AI models from Mistral. Unlimited tier is free for everyone!",
};

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const token = await getToken();

  if (token) {
    redirect(indexPath());
  }

  return (
    <div className="flex h-full min-h-screen min-w-screen flex-col items-center justify-center">
      {children}
    </div>
  );
};

export default Layout;
