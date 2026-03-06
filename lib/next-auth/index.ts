// DONE_PRITH
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import neonDBClient from "@/lib/neon-db";
import { envConfig } from "@/lib/envConfig";
import UserRepo from "@/backend/repositories/UserRepo";
import MetadataRepo from "@/backend/repositories/MetadataRepo";
import { accounts, users } from "@/backend/db/tables";
import * as Schemas from "@/schemas";
import Log from "../pino/Log";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(neonDBClient, {
    usersTable: users,
    accountsTable: accounts,
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
        const roleId = trigger === "update" ? session.roleId : user.roleId;
        token.roleId = roleId;

        const response = await MetadataRepo.getFeaturesByRoleId(roleId);
        if (!response) {
          Log.error(`Failed to fetch features for roleId: ${roleId}`);
          return token;
        }

        token.features = response;

        token.access = await UserRepo.calculateAccessBitmask(response);
      }
      return token;
    },
    async session({ session, token }) {
      if (token.sub) {
        session.user.id = token.sub;
        session.user.roleId = token.roleId as string;
        session.user.roleName = token.roleName as string;
        session.user.features = token.features as string[];
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

export async function currentUser(): Promise<Schemas.CurrentUser | null> {
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
