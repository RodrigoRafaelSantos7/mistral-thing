"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type * as React from "react";
import { THEME_OPTIONS, THEME_STORAGE_KEY } from "@/lib/config";
import { useUserSettings } from "@/lib/user-settings-store/provider";

export function ThemeProvider({
  children,
}: React.ComponentProps<typeof NextThemesProvider>) {
  const { settings } = useUserSettings();
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme={`${settings.theme}-${settings.mode}`}
      disableTransitionOnChange
      enableSystem={false}
      storageKey={THEME_STORAGE_KEY}
      themes={THEME_OPTIONS}
    >
      {children}
    </NextThemesProvider>
  );
}
