import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import neonDBClient from "@/lib/neon-db";
import { envConfig } from "@/lib/envConfig";
import MetadataRepo from "@/backend/repositories/MetadataRepo";
import { accounts, users } from "@/backend/db/tables";
import * as Schemas from "@/schemas";
import Log from "../pino/Log";

const drizzleAdapter = DrizzleAdapter(neonDBClient, {
  usersTable: users,
  accountsTable: accounts,
});

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: {
    ...drizzleAdapter,
    createUser: async (data: any) => {
      return drizzleAdapter.createUser!({
        ...data,
        role_id: Schemas.UserRole.Learner,
      });
    },
  },
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
        // DEV_NOTE: While signing in, database row is passed, hence we need role_id
        const roleId =
          trigger === "update" ? session.roleId : (user as any).role_id;
        token.roleId = roleId;

        const { features, roleName } =
          await MetadataRepo.getRoleDataById(roleId);

        if (!features.length) {
          Log.warn(`No features found for roleId: ${roleId}`);
        }

        token.roleName = roleName;
        token.features = features;
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

// Server-side helper — the async mirror of the client-side useAuth() hook.

interface ServerAuthResponse {
  currentUser: Schemas.CurrentUser | null;
  isAuthenticated: boolean;
  hasFeature: (featureId: string) => boolean;
}

export async function serverAuth(): Promise<ServerAuthResponse> {
  const session = await auth();
  const { id, name, email, image, roleId, roleName, features } =
    session?.user ?? {};

  const currentUser: Schemas.CurrentUser | null = id
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
    currentUser?.features?.includes(featureId) ?? false;

  return { currentUser, isAuthenticated: !!currentUser, hasFeature };
}
