import type { Metadata } from "next";
import { PreferencesView } from "@/modules/account/ui/views/preferences-view";

export const metadata: Metadata = {
  title: "Preferences",
  description: "Manage your preferences on Mistral Thing",
};

const Page = () => <PreferencesView />;

export default Page;
