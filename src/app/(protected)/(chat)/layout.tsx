import type { ReactNode } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";

const ChatLayout = ({ children }: { children: ReactNode }) => (
  <SidebarProvider>{children}</SidebarProvider>
);

export default ChatLayout;
