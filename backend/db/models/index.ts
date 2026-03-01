import {
  pgTable,
  text,
  timestamp,
  integer,
  bigserial,
  jsonb,
  varchar,
  boolean,
  unique,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import type { AdapterAccountType } from "next-auth/adapters";

export const roles = pgTable("roles", {
  id: varchar("id", { length: 20 }).primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const features = pgTable(
  "features",
  {
    id: varchar("id", { length: 20 }).primaryKey(),
    description: varchar("description", { length: 255 }).notNull(),
    permBit: integer("perm_bit").notNull(),
    permBitIndex: integer("perm_bit_index").notNull(),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => ({
    uniquePerm: unique().on(table.permBit, table.permBitIndex),
  }),
);

export const roleFeatures = pgTable(
  "role_features",
  {
    id: integer("id").generatedAlwaysAsIdentity().primaryKey(),
    roleId: varchar("role_id", { length: 20 }).notNull(),
    featureId: varchar("feature_id", { length: 20 }).notNull(),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => ({
    roleFeaturePk: unique().on(table.roleId, table.featureId),
  }),
);

export const users = pgTable("users", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: text("name"),
  email: text("email").notNull().unique(),
  emailVerified: timestamp("email_verified", { mode: "date" }),
  image: text("image"),
  roleId: varchar("role_id", { length: 20 }).notNull().default("LEARNER"),
});

export const accounts = pgTable("accounts", {
  userId: text("user_id").notNull(),
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
});

export const sdiProblems = pgTable("sdi_problems", {
  id: bigserial("id", { mode: "bigint" }).primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  functionalRequirements: text("functional_requirements").array().notNull(),
  nonFunctionalRequirements: text("non_functional_requirements")
    .array()
    .notNull(),
  boteFactors: text("bote_factors").array().notNull(),
  difficulty: text("difficulty").notNull(),
  tags: text("tags").array(),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }),
});

export const interviews = pgTable("interviews", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: text("user_id").notNull(),
  problemId: integer("problem_id").notNull(),
  status: integer("status").notNull().default(1),
  currentPhase: integer("current_phase").notNull().default(1),
  startTime: timestamp("start_time", { mode: "date" }).notNull().defaultNow(),
  endTime: timestamp("end_time", { mode: "date" }),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
});

export const aiChats = pgTable("ai_chats", {
  id: bigserial("id", { mode: "bigint" }).primaryKey(),
  sessionId: text("session_id").notNull(),
  role: integer("role").notNull(),
  content: jsonb("content").notNull(),
  phase: integer("phase").notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
});

export const redFlags = pgTable("red_flags", {
  id: bigserial("id", { mode: "bigint" }).primaryKey(),
  sessionId: text("session_id").notNull(),
  type: text("type").notNull(),
  reason: text("reason").notNull(),
  phase: integer("phase").notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
});

export const hldDiagrams = pgTable("hld_diagrams", {
  id: bigserial("id", { mode: "bigint" }).primaryKey(),
  sessionId: text("session_id").notNull(),
  topology: jsonb("topology").notNull(),
  rawReactFlow: jsonb("raw_react_flow").notNull(),
  phase: integer("phase").notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
  createdBy: text("created_by").notNull(),
  updatedBy: text("updated_by").notNull(),
});

export const sdiScorecards = pgTable("sdi_scorecards", {
  id: bigserial("id", { mode: "bigint" }).primaryKey(),
  sessionId: text("session_id").notNull(),
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
