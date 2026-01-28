import {
  pgTable,
  text,
  timestamp,
  integer,
  bigserial,
  bigint,
  jsonb,
  primaryKey,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import type { AdapterAccountType } from "next-auth/adapters";

// --- USERS ---
export const users = pgTable("users", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: text("name"),
  email: text("email").notNull().unique(),
  emailVerified: timestamp("email_verified", { mode: "date" }),
  image: text("image"),
});

// --- ACCOUNTS ---
export const accounts = pgTable(
  "accounts",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("provider_account_id").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (table) => ({
    compoundKey: primaryKey({
      columns: [table.provider, table.providerAccountId],
    }),
  }),
);

// --- USER SESSIONS ---
export const userSessions = pgTable("user_sessions", {
  sessionToken: text("session_token").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

// --- VERIFICATION TOKENS ---
export const verificationTokens = pgTable(
  "verification_tokens",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (table) => ({
    compoundKey: primaryKey({ columns: [table.identifier, table.token] }),
  }),
);

// --- SDI SESSIONS ---
export const sdiSessions = pgTable("sdi_sessions", {
  id: bigserial("id", { mode: "bigint" }).primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  problemId: text("problem_id").notNull(),
  status: integer("status").notNull().default(1),
  currentPhase: integer("current_phase").notNull().default(1),
  startTime: timestamp("start_time", { mode: "date" }).notNull().defaultNow(),
  endTime: timestamp("end_time", { mode: "date" }),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
});

// --- AI CHATS ---
export const aiChats = pgTable("ai_chats", {
  id: bigserial("id", { mode: "bigint" }).primaryKey(),
  sessionId: bigint("session_id", { mode: "bigint" })
    .notNull()
    .references(() => sdiSessions.id),
  role: integer("role").notNull(),
  content: text("content").notNull(),
  phase: integer("phase").notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
});

// --- HLD DIAGRAMS ---
export const hldDiagrams = pgTable("hld_diagrams", {
  id: bigserial("id", { mode: "bigint" }).primaryKey(),
  sessionId: bigint("session_id", { mode: "bigint" })
    .notNull()
    .references(() => sdiSessions.id),
  topology: jsonb("topology").notNull(),
  rawReactFlow: jsonb("raw_react_flow").notNull(),
  phase: integer("phase").notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
  createdBy: text("created_by")
    .notNull()
    .references(() => users.id),
  updatedBy: text("updated_by")
    .notNull()
    .references(() => users.id),
});

// --- SDI SCORECARDS ---
export const sdiScorecards = pgTable("sdi_scorecards", {
  id: bigserial("id", { mode: "bigint" }).primaryKey(),
  sessionId: bigint("session_id", { mode: "bigint" })
    .notNull()
    .references(() => sdiSessions.id),
  overallGrade: integer("overall_grade").notNull(),
  requirementsGathering: integer("requirements_gathering").notNull(),
  dataModeling: integer("data_modeling").notNull(),
  tradeOffAnalysis: integer("trade_off_analysis").notNull(),
  scalability: integer("scalability").notNull(),
  strengths: text("strengths").array().notNull(),
  growthAreas: text("growth_areas").array().notNull(),
  actionableFeedback: text("actionable_feedback").notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
});
