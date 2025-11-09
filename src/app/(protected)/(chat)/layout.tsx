import type { ReactNode } from "react";
import { AppSidebar } from "@/components/app/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

const ChatLayout = ({ children }: { children: ReactNode }) => (
  <SidebarProvider>
    <AppSidebar />
    {children}
  </SidebarProvider>
);

export default ChatLayout;
