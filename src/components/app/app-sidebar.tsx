import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { DynamicImage } from "@/components/app/dynamic-image";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { indexPath } from "@/paths";

export function AppSidebar() {
  return (
    <Sidebar>
      <AppSidebarHeader />
      <SidebarContent>
        <AppSidebarActions />
      </SidebarContent>
    </Sidebar>
  );
}

function AppSidebarHeader() {
  return (
    <SidebarHeader className="p-3">
      <Button asChild size="icon" variant="ghost">
        <Link href={indexPath()}>
          <DynamicImage
            alt="Mistral Thing Logo"
            darkSrc="/icon-white.svg"
            height={24}
            lightSrc="/icon.svg"
            width={24}
          />
        </Link>
      </Button>
    </SidebarHeader>
  );
}

function AppSidebarActions() {
  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href={indexPath()}>
                <PlusIcon />
                <span className="flex-1">New Thread</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
