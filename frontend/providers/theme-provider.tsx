// DONE_PRITH

"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";

/* DEV_NOTE:
Reads the resolved theme and applies it as a class on a wrapper <div>,
keeping next-themes away from <html> to avoid SSR hydration mismatches.
*/
function ThemeWrapper({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className={mounted && resolvedTheme ? resolvedTheme : ""}>
      {children}
    </div>
  );
}

/*DEV_NOTE:
`attribute="data-theme"` prevents next-themes from mutating html's `class`.
ThemeWrapper applies the theme class to a <div> so Tailwind's `dark:` variants work.
 */
function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider {...props} attribute="data-theme">
      <ThemeWrapper>{children}</ThemeWrapper>
    </NextThemesProvider>
  );
}

export default ThemeProvider;
