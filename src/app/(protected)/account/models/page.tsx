import type { Metadata } from "next";
import { ModelsView } from "@/modules/account/ui/views/models-view";

export const metadata: Metadata = {
  title: "Models",
  description: "Manage your model preferences on Mistral Thing",
};

const Page = () => <ModelsView />;

export default Page;
