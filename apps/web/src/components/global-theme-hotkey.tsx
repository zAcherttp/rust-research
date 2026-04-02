"use client";

import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import { useHotkeys } from "react-hotkeys-hook";

export function GlobalThemeHotkey() {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const isMovementVisualization =
    pathname === "/visualizations/grid-based-2d-character-movement-controller";

  useHotkeys(["d"], () => {
    if (isMovementVisualization) {
      return;
    }

    setTheme(theme === "dark" ? "light" : "dark");
  });

  return null;
}
