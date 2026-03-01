import NextAuth from "next-auth";
import type { DefaultSession } from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/backend/db";
import * as schema from "@/backend/db/models";
import { envConfig } from "@/lib/envConfig";
import UserDAL from "@/backend/data-access-layer/UserDAL";
import UserRepo from "@/backend/repositories/UserRepo";
import MetadataRepo from "@/backend/repositories/MetadataRepo";
import { JWT } from "next-auth/jwt";

// Augment the session user type to include `id`, `roleId`, and `features`
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      roleId: string;
      roleName: string;
      features: string[];
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    roleId: string;
    roleName: string;
    features: string[];
    access: number[];
  }
}

export interface CurrentUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  roleId: string;
  roleName: string;
  features: string[];
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: schema.users,
    accountsTable: schema.accounts,
  }),
  providers: [
    Google({
      clientId: envConfig.GOOGLE_CLIENT_ID,
      clientSecret: envConfig.GOOGLE_CLIENT_SECRET,
    }),
    GitHub({
      clientId: envConfig.GITHUB_CLIENT_ID,
      clientSecret: envConfig.GITHUB_CLIENT_SECRET,
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 60, // 30 minutes
    updateAge: 5 * 60, // Roll token when less than 5 min remain
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user || trigger === "update") {
        const roleId =
          trigger === "update"
            ? session.roleId
            : ((user as typeof user & { roleId?: string }).roleId ?? "LEARNER");
        token.roleId = roleId;

        const allRoles = await MetadataRepo.getAllRoles();
        const foundRole = allRoles.find(
          (r: { id: string; name: string }) => r.id === roleId,
        );
        token.roleName = foundRole ? foundRole.name : "Unknown Role";

        // Fetch feature IDs for this role
        const featureIds = await UserDAL.getFeaturesByRole(roleId);
        token.features = featureIds;

        // Compute access bitmask and store securely in token
        token.access = await UserRepo.calculateAccessBitmask(featureIds);
      }
      return token;
    },
    async session({ session, token }) {
      if (token.sub) {
        session.user.id = token.sub;
        session.user.roleId = token.roleId;
        session.user.roleName = token.roleName;
        session.user.features = token.features;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth",
  },
  trustHost: !!envConfig.AUTH_TRUST_HOST,
});

// Server-side helper to get the current authenticated user.

export async function currentUser(): Promise<CurrentUser | null> {
  const session = await auth();

  const { id, name, email, image, roleId, roleName, features } =
    session?.user ?? {};

  if (!id) return null;

  return {
    id,
    name,
    email,
    image,
    roleId: roleId ?? "",
    roleName: roleName ?? "",
    features: features ?? [],
  };
}
