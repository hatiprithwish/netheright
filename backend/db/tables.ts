// DONE_PRITH
import {
  pgTable,
  text,
  timestamp,
  integer,
  jsonb,
  boolean,
  unique,
  bigint,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import type { AdapterAccountType } from "next-auth/adapters";
import * as Schemas from "@/schemas";

/*
DEV_NOTE: 
1. Using TEXT instead of VARCHAR because in PostgreSQL, there is no performance difference between varchar, varchar(n), and text.
2. Using JSONB to instead of JSON because of performance, indexing & advanced operators.
*/

export const roles = pgTable("roles", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  is_active: boolean("is_active").notNull().default(true),
  created_at: timestamp("created_at").notNull().defaultNow(),
});

export const features = pgTable(
  "features",
  {
    id: text("id").primaryKey(),
    description: text("description").notNull(),
    perm_bit: integer("perm_bit").notNull(),
    perm_bit_index: integer("perm_bit_index").notNull(),
    is_active: boolean("is_active").notNull().default(true),
    created_at: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    unique("UK_features_perm_bit").on(table.perm_bit, table.perm_bit_index),
  ],
);

export const role_features = pgTable(
  "role_features",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    role_id: text("role_id").notNull(),
    feature_id: text("feature_id").notNull(),
    is_active: boolean("is_active").notNull().default(true),
    created_at: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    unique("UK_role_features_role_id").on(table.role_id, table.feature_id),
  ],
);

export const users = pgTable("users", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  //🔽 DEV_NOTE: Kept in camelCase for next-auth adapter compatibility
  emailVerified: timestamp("email_verified", { mode: "date" }),
  image: text("image"),
  role_id: text("role_id").notNull(),
});

export const accounts = pgTable("accounts", {
  //🔽 DEV_NOTE: Kept in camelCase for next-auth adapter compatibility
  userId: text("user_id").notNull(),
  type: text("type").$type<AdapterAccountType>().notNull(),
  provider: text("provider").$type<Schemas.AccountProviderType>().notNull(),
  //🔽 DEV_NOTE: Kept in camelCase for next-auth adapter compatibility
  providerAccountId: text("provider_account_id").notNull(),
  refresh_token: text("refresh_token"),
  access_token: text("access_token"),
  expires_at: integer("expires_at"),
  token_type: text("token_type"),
  scope: text("scope"),
  id_token: text("id_token"),
  session_state: text("session_state"),
});

export const problems = pgTable("problems", {
  id: bigint("id", { mode: "bigint" }).primaryKey().generatedAlwaysAsIdentity(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  functional_requirements: text("functional_requirements").array().notNull(),
  non_functional_requirements: text("non_functional_requirements")
    .array()
    .notNull(),
  bote_factors: text("bote_factors").array().notNull(),
  difficulty: text("difficulty")
    .$type<Schemas.ProblemDifficultyEnum>()
    .notNull(),
  tags: text("tags").array(),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at"),
});

export const interviews = pgTable("interviews", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  user_id: text("user_id").notNull(),
  problem_id: integer("problem_id").notNull(),
  status: integer("status")
    .$type<Schemas.InterviewStatusIntEnum>()
    .notNull()
    .default(Schemas.InterviewStatusIntEnum.Active),
  phase: integer("phase")
    .$type<Schemas.InterviewPhaseIntEnum>()
    .notNull()
    .default(Schemas.InterviewPhaseIntEnum.RequirementsGathering),
  start_time: timestamp("start_time").notNull().defaultNow(),
  end_time: timestamp("end_time"),
  is_test: boolean("is_test").notNull().default(false),
  created_at: timestamp("created_at").notNull().defaultNow(),
});

export const interview_chats = pgTable("interview_chats", {
  id: bigint("id", { mode: "bigint" }).primaryKey().generatedAlwaysAsIdentity(),
  interview_id: text("interview_id").notNull(),
  role: integer("role").$type<Schemas.ChatRoleIntEnum>().notNull(),
  content: jsonb("content").notNull(),
  phase: integer("phase").$type<Schemas.InterviewPhaseIntEnum>().notNull(),
  created_at: timestamp("created_at").notNull().defaultNow(),
});

export const red_flags = pgTable("red_flags", {
  id: bigint("id", { mode: "bigint" }).primaryKey().generatedAlwaysAsIdentity(),
  interview_id: text("interview_id").notNull(),
  type: text("type").$type<Schemas.RedFlagTypeEnum>().notNull(),
  reason: text("reason").notNull(),
  phase: integer("phase").$type<Schemas.InterviewPhaseIntEnum>().notNull(),
  created_at: timestamp("created_at").notNull().defaultNow(),
});

export const hld_diagrams = pgTable("hld_diagrams", {
  id: bigint("id", { mode: "bigint" }).primaryKey().generatedAlwaysAsIdentity(),
  interview_id: text("interview_id").notNull(),
  topology: jsonb("topology").notNull(),
  raw_diagram: jsonb("raw_diagram").notNull(),
  phase: integer("phase").$type<Schemas.InterviewPhaseIntEnum>().notNull(),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at"),
  created_by: text("created_by").notNull(),
  updated_by: text("updated_by").notNull(),
});

export const scorecards = pgTable("scorecards", {
  id: bigint("id", { mode: "bigint" }).primaryKey().generatedAlwaysAsIdentity(),
  interview_id: text("interview_id").notNull(),
  overall_grade: integer("overall_grade")
    .$type<Schemas.InterviewGradeIntEnum>()
    .notNull(),
  requirements_gathering: integer("requirements_gathering")
    .$type<Schemas.InterviewGradeIntEnum>()
    .notNull(),
  data_modeling: integer("data_modeling")
    .$type<Schemas.InterviewGradeIntEnum>()
    .notNull(),
  trade_off_analysis: integer("trade_off_analysis")
    .$type<Schemas.InterviewGradeIntEnum>()
    .notNull(),
  scalability: integer("scalability")
    .$type<Schemas.InterviewGradeIntEnum>()
    .notNull(),
  strengths: text("strengths").array().notNull(),
  growth_areas: text("growth_areas").array().notNull(),
  actionable_feedback: text("actionable_feedback").notNull(),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at"),
});
