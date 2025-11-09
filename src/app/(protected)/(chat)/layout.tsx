import type { ReactNode } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AuthGuard } from "@/modules/auth/ui/components/auth-guard";

const ChatLayout = ({ children }: { children: ReactNode }) => (
  <AuthGuard>
    <SidebarProvider>{children}</SidebarProvider>
  </AuthGuard>
);

export default ChatLayout;
