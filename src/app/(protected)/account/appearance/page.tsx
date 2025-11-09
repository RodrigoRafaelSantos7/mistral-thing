import type { Metadata } from "next";
import { AppearanceView } from "@/modules/account/ui/views/appearance-view";

export const metadata: Metadata = {
  title: "Appearance",
  description: "Manage your appearance settings on Mistral Thing",
};

const Page = () => <AppearanceView />;

export default Page;
