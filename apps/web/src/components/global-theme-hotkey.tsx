"use client";

import { useTheme } from "next-themes";
import { useHotkeys } from "react-hotkeys-hook";

export function GlobalThemeHotkey() {
  const { theme, setTheme } = useTheme();

  useHotkeys(["d"], () => {
    setTheme(theme === "dark" ? "light" : "dark");
  });

  return null;
}
