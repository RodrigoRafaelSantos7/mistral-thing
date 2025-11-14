"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type * as React from "react";

export function ThemeProvider({
  children,
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider
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
      {children}
    </NextThemesProvider>
  );
}
