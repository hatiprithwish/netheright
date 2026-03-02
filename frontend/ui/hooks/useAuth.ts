"use client";

import { useSession, signOut } from "next-auth/react";
import type { CurrentUser } from "@/lib/next-auth";

interface UseAuthResponse {
  currentUser: CurrentUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  hasFeature: (featureId: string) => boolean;
  switchRole: (roleId: string) => Promise<void>;
  signOut: () => Promise<void>;
}

// Client-side hook for accessing the current authenticated user.
export function useAuth(): UseAuthResponse {
  const { data: session, status, update } = useSession();

  const { id, name, email, image, roleId, roleName, features } =
    session?.user ?? {};

  const user: CurrentUser | null = id
    ? {
        id,
        name,
        email,
        image,
        roleId: roleId ?? "",
        roleName: roleName ?? "",
        features: features ?? [],
      }
    : null;

  const hasFeature = (featureId: string): boolean =>
    features?.includes(featureId) ?? false;

  const switchRole = async (newRoleId: string) => {
    await fetch(`/api/${id}/switch-role`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roleId: newRoleId }),
    });
    // Force JWT callback to run and issue fresh token with new permissions
    await update({ roleId: newRoleId });
  };

  return {
    currentUser: user,
    isLoading: status === "loading",
    isAuthenticated: status === "authenticated",
    hasFeature,
    switchRole,
    signOut: () => signOut(),
  };
}
