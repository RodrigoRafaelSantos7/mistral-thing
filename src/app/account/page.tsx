import { preloadQuery } from "convex/nextjs";
import type { Metadata } from "next";
import { api } from "@/convex/_generated/api";
import { getToken } from "@/lib/auth-server";
import AccountView from "@/modules/account/ui/views/account-view";

export const metadata: Metadata = {
  title: "Account",
  description: "Manage your account settings and preferences on Mistral Thing",
};

const Page = async () => {
  const token = await getToken();
  const sessions = await preloadQuery(api.users.getAllSessions, {}, { token });

  return <AccountView preloadedSessions={sessions} />;
};

export default Page;
