"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type * as React from "react";
import {
  DEFAULT_MODE,
  DEFAULT_THEME,
  STORAGE_KEY,
  THEME_OPTIONS,
} from "@/config/themes";

export function ThemeProvider({
  children,
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme={`${DEFAULT_THEME}-${DEFAULT_MODE}`}
      disableTransitionOnChange
      enableSystem={false}
      storageKey={STORAGE_KEY}
      themes={THEME_OPTIONS}
    >
      {children}
    </NextThemesProvider>
  );
}
