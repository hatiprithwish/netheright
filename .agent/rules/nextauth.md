---
trigger: always_on
---

# NextAuth (Auth.js) with Drizzle Adapter Best Practices

This rule ensures proper implementation of NextAuth (Auth.js) with the Drizzle Adapter in Next.js App Router projects, focusing on type safety, performance, and scalability.

## Configuration & Schema

### 1. Centralize Auth Configuration

**ALWAYS** create a single `auth.ts` file in your root or `lib/` directory to export `handlers`, `auth`, `signIn`, and `signOut`.

```typescript
// ✅ GOOD: lib/auth.ts or auth.ts in root
import NextAuth from "next-auth"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { db } from "@/db"
import { users, accounts, sessions, verificationTokens } from "@/db/schema/auth"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  // ... other config
})

// ❌ BAD: Defining auth config in multiple places
// This creates circular dependencies when importing into Server Components
```

**Why:** This avoids circular dependencies when importing the `auth` function into Server Components or Server Actions.

### 2. Explicit Table Mapping

**ALWAYS** explicitly pass your tables to the `DrizzleAdapter` function.

```typescript
// ✅ GOOD: Explicit table mapping
adapter: DrizzleAdapter(db, {
  usersTable: users,
  accountsTable: accounts,
  sessionsTable: sessions,
  verificationTokensTable: verificationTokens,
})

// ❌ BAD: Relying on default table names
adapter: DrizzleAdapter(db)
```

**Why:** This allows you to rename tables (e.g., using `users` instead of the default `user`) and add custom columns easily.

### 3. Modular Schema Organization

**ALWAYS** keep auth-related tables in a separate file (e.g., `db/schema/auth.ts`) or a clearly marked section.

```typescript
// ✅ GOOD: db/schema/auth.ts
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name"),
  email: text("email").notNull(),
  emailVerified: timestamp("email_verified", { mode: "date" }),
  image: text("image"),
  // Custom fields
  role: text("role").default("user"),
  username: text("username"),
})

export const accounts = pgTable("accounts", {
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  provider: text("provider").notNull(),
  providerAccountId: text("provider_account_id").notNull(),
  refresh_token: text("refresh_token"),
  access_token: text("access_token"),
  expires_at: timestamp("expires_at", { mode: "date" }),
  token_type: text("token_type"),
  scope: text("scope"),
  id_token: text("id_token"),
  session_state: text("session_state"),
})

export const sessions = pgTable("sessions", {
  sessionToken: text("session_token").notNull().primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
})

export const verificationTokens = pgTable("verification_tokens", {
  identifier: text("identifier").notNull(),
  token: text("token").notNull(),
  expires: timestamp("expires", { mode: "date" }).notNull(),
})

// ❌ BAD: Mixing auth tables with business logic tables in one file
```

**Use Drizzle's `relations` API** to link the `users` table to your other business logic tables:

```typescript
// ✅ GOOD: db/schema/relations.ts
import { relations } from "drizzle-orm"
import { users } from "./auth"
import { posts, profiles } from "./business"

export const usersRelations = relations(users, ({ one, many }) => ({
  profile: one(profiles, {
    fields: [users.id],
    references: [profiles.userId],
  }),
  posts: many(posts),
}))
```

### 4. Use UUIDs over Auto-Increment

**ALWAYS** use `uuid` or `cuid` for the `id` fields in your auth tables.

```typescript
// ✅ GOOD: Using UUID
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  // ... other fields
})

// ❌ BAD: Using auto-increment
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  // ... other fields
})
```

**Why:** UUIDs are more secure and make horizontal scaling or data migration between databases much easier.

## Performance & Security

### 5. Choose the Right Session Strategy

**Database Session Strategy (Default):** Use when you need to revoke sessions manually or track active logins.

```typescript
// ✅ GOOD: Database sessions (default when adapter is present)
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db, { /* tables */ }),
  session: { strategy: "database" }, // Explicit, but this is the default
  // ... other config
})
```

**JWT Session Strategy:** Use when performance is a higher priority than session control.

```typescript
// ✅ GOOD: JWT sessions for better performance
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db, { /* tables */ }),
  session: { strategy: "jwt" }, // Force JWT even with adapter
  // ... other config
})
```

### 6. Edge Compatibility

**ALWAYS** ensure your database driver and Drizzle client are edge-compatible when deploying to edge environments.

```typescript
// ✅ GOOD: Edge-compatible setup (Vercel Edge, Cloudflare Workers)
import { drizzle } from "drizzle-orm/neon-http"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)
export const db = drizzle(sql)

// ❌ BAD: Using node-postgres in edge environment
import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"
```

### 7. Middleware Protection

**ALWAYS** use NextAuth Middleware to protect entire route segments efficiently.

```typescript
// ✅ GOOD: middleware.ts
export { auth as middleware } from "@/lib/auth"

export const config = {
  matcher: ["/dashboard/:path*", "/api/protected/:path*"],
}

// ❌ BAD: Checking session in every Page/Layout
// app/dashboard/page.tsx
export default async function DashboardPage() {
  const session = await auth()
  if (!session) redirect("/login")
  // ...
}
```

**Why:** Middleware is faster than checking for a session inside every single Page or Layout file.

### 8. Environment Variable Validation

**ALWAYS** validate `AUTH_SECRET` and database connection strings at runtime using a library like `zod`.

```typescript
// ✅ GOOD: lib/env.ts
import { z } from "zod"

const envSchema = z.object({
  AUTH_SECRET: z.string().min(32),
  DATABASE_URL: z.string().url(),
  NEXTAUTH_URL: z.string().url().optional(),
})

export const env = envSchema.parse(process.env)

// ❌ BAD: Using process.env directly without validation
const secret = process.env.AUTH_SECRET
```

## Advanced Pattern: Custom Columns

When adding custom fields like `role` or `username` to the user object:

### 1. Update Database Schema

```typescript
// ✅ GOOD: db/schema/auth.ts
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name"),
  email: text("email").notNull(),
  emailVerified: timestamp("email_verified", { mode: "date" }),
  image: text("image"),
  // Custom fields
  role: text("role").default("user"),
  username: text("username"),
})
```

### 2. Use Auth Callbacks

```typescript
// ✅ GOOD: lib/auth.ts
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db, { /* tables */ }),
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.username = user.username
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string
        session.user.username = token.username as string
      }
      return session
    },
  },
})
```

### 3. TypeScript Declaration

```typescript
// ✅ GOOD: next-auth.d.ts
import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      role: string
      username: string
    } & DefaultSession["user"]
  }

  interface User {
    role: string
    username: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string
    username: string
  }
}
```

## API Route Handler

**ALWAYS** use the exported `handlers` in your API route:

```typescript
// ✅ GOOD: app/api/auth/[...nextauth]/route.ts
import { handlers } from "@/lib/auth"

export const { GET, POST } = handlers

// ❌ BAD: Creating custom handlers
export async function GET(request: Request) {
  // Custom implementation
}
```
