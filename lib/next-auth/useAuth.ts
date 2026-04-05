"use client";

import { useSession, signOut } from "next-auth/react";
import * as Schemas from "@/schemas";

interface UseAuthResponse {
  currentUser: Schemas.CurrentUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  hasFeature: (featureId: string) => boolean;
  signOut: () => Promise<void>;
}

// Client-side hook for accessing the current authenticated user.
export function useAuth(): UseAuthResponse {
  const { data: session, status } = useSession();

  const user = session?.user ? (session.user as Schemas.CurrentUser) : null;

  const hasFeature = (featureId: string): boolean =>
    user?.features?.includes(featureId) ?? false;

  return {
    currentUser: user,
    isLoading: status === "loading",
    isAuthenticated: status === "authenticated",
    hasFeature,
    signOut: () => signOut(),
  };
}
