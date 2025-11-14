import { AppSidebar } from "@/components/layout/app-sidebar";
import { Header } from "@/components/layout/header";

export function LayoutApp({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-dvh w-full overflow-hidden bg-background">
      <AppSidebar />
      <main className="@container relative h-dvh w-0 shrink grow overflow-y-auto">
        <Header />
        {children}
      </main>
    </div>
  );
}
