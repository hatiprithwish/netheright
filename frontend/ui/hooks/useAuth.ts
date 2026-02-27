"use client";

import { useSession, signOut } from "next-auth/react";
import type { CurrentUser } from "@/lib/next-auth";

interface UseAuthResponse {
  currentUser: CurrentUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signOut: () => Promise<void>;
}

// Client-side hook for accessing the current authenticated user.
export function useAuth(): UseAuthResponse {
  const { data: session, status } = useSession();

  const { id, name, email, image } = session?.user ?? {};

  const user: CurrentUser | null = id ? { id, name, email, image } : null;

  return {
    currentUser: user,
    isLoading: status === "loading",
    isAuthenticated: status === "authenticated",
    signOut: () => signOut(),
  };
}
