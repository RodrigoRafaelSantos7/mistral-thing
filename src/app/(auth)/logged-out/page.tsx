import type { Metadata } from "next";
import { LoggedOutView } from "@/modules/auth/ui/views/logged-out-view";

export const metadata: Metadata = {
  title: "Logged Out Successfully",
};

const Page = () => <LoggedOutView />;

export default Page;
