"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { THEME_OPTIONS, Theme } from "./utils";

interface ThemeTogglerProps {
  variant: "icon" | "menu";
}

export default function ThemeToggler({ variant }: ThemeTogglerProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // DEV_NOTE: waits until the browser is fully loaded to prevent theme flash
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = (theme as Theme) || Theme.System;

  const cycleTheme = () => {
    setTheme(THEME_OPTIONS[currentTheme].next);
  };

  const activeTheme = mounted ? currentTheme : Theme.System;
  const Icon = THEME_OPTIONS[activeTheme].icon;

  if (variant === "menu") {
    return (
      <button
        onClick={cycleTheme}
        disabled={!mounted}
        aria-label="Change Theme"
        className={cn(
          "flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-base font-medium transition-colors",
          mounted
            ? "text-muted-foreground hover:bg-muted hover:text-foreground"
            : "opacity-40 cursor-not-allowed",
        )}
      >
        <span className="flex-1 text-left">Change Theme</span>
        <div className="flex items-center gap-2 text-xs font-normal text-muted-foreground capitalize">
          <Icon className="h-5 w-5" />
        </div>
      </button>
    );
  }

  return (
    <button
      onClick={cycleTheme}
      disabled={!mounted}
      className={cn(
        "p-2 rounded-md transition-colors relative flex items-center justify-center",
        mounted
          ? "hover:bg-accent hover:text-accent-foreground"
          : "opacity-40 cursor-not-allowed",
      )}
      aria-label="Toggle theme"
      title={`Current theme: ${mounted ? theme : "system"}`}
    >
      <Icon className="h-5 w-5" />
    </button>
  );
}
