import type { ReactNode } from "react";
import { ConvexClientProvider } from "@/components/providers/convex-client-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { DatabaseProvider } from "@/context/database";

const Providers = ({ children }: { children: ReactNode }) => (
  <ConvexClientProvider>
    <ThemeProvider
      attribute="class"
      defaultTheme="default-dark"
      disableTransitionOnChange
      enableSystem={false}
      storageKey="mistral-thing-theme"
      themes={[
        "default-light",
        "default-dark",
        "t3-chat-light",
        "t3-chat-dark",
        "claymorphism-light",
        "claymorphism-dark",
        "claude-light",
        "claude-dark",
        "graphite-light",
        "graphite-dark",
        "amethyst-haze-light",
        "amethyst-haze-dark",
        "vercel-light",
        "vercel-dark",
      ]}
    >
      <DatabaseProvider>{children}</DatabaseProvider>
    </ThemeProvider>
  </ConvexClientProvider>
);

export default Providers;
