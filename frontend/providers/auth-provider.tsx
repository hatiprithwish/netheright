// DONE_PRITH

"use client";

import { SessionProvider } from "next-auth/react";

// DEV_NOTE: To securely pass the auth context down to your client components (like the Header) without forcing the entire root layout to become a client component.
function AuthProvider({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}

export default AuthProvider;
