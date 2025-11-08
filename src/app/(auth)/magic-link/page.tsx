import type { Metadata } from "next";
import { MagicLinkView } from "@/modules/auth/ui/views/magic-link-view";

export const metadata: Metadata = {
  title: "Magic Link Sent",
};

const Page = () => <MagicLinkView />;

export default Page;
