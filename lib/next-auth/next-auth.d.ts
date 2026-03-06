import { DefaultSession } from "next-auth";

declare module "next-auth" {
  // 1. Session: Data available to your app (client/server) via `useSession()` or `auth()`
  interface Session {
    user: {
      id: string;
      roleId: string;
      roleName: string;
      features: string[];
    } & DefaultSession["user"];
  }

  // 2. User: Data returned directly from the Database Adapter or OAuth Provider on login
  interface User {
    // DEV_NOTE: Keeping them optional to be adaptar & provider compatible
    roleId?: string;
    roleName?: string;
  }
}

declare module "next-auth/jwt" {
  // 3. JWT: Data stored inside the encrypted cookie to avoid DB calls on every request
  interface JWT {
    roleId: string;
    roleName: string;
    features: string[];
    access: number[]; // DEV_NOTE: Lives only in JWT
  }
}
