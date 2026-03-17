"use client";

import { useTheme as useNextTheme } from "next-themes";
import { useEffect, useState } from "react";

export function useTheme() {
  const { theme, setTheme, systemTheme, resolvedTheme } = useNextTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = mounted ? resolvedTheme : "light";
  const isDark = currentTheme === "dark";
  const isLight = currentTheme === "light";
  const isSystem = theme === "system";

  const toggleTheme = () => {
    if (isDark) {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  };

  return {
    theme,
    setTheme,
    systemTheme,
    resolvedTheme: currentTheme,
    isDark,
    isLight,
    isSystem,
    toggleTheme,
    mounted,
  };
}
