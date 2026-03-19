import { Moon, Sun, Monitor } from "lucide-react";

export const HeaderLinks = [
  {
    label: "Dashboard",
    href: "/dashboard",
    isProtected: true,
  },
  {
    label: "Problems",
    href: "/problems",
    isProtected: false,
  },
  {
    label: "Architecture",
    href: "/architecture",
    isProtected: false,
  },
];

export enum Theme {
  Light = "light",
  Dark = "dark",
  System = "system",
}

export const THEME_OPTIONS = {
  [Theme.Light]: {
    next: Theme.Dark,
    icon: Sun,
  },
  [Theme.Dark]: {
    next: Theme.System,
    icon: Moon,
  },
  [Theme.System]: {
    next: Theme.Light,
    icon: Monitor,
  },
};
