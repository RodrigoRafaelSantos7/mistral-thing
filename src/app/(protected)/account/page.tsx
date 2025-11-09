import type { Metadata } from "next";
import AccountView from "@/modules/account/ui/views/account-view";

export const metadata: Metadata = {
  title: "Account",
  description: "Manage your account settings and preferences on Mistral Thing",
};

const Page = () => <AccountView />;

export default Page;
