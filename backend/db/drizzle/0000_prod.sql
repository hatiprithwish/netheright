CREATE TABLE "accounts" (
	"user_id" text NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"provider_account_id" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text
);
--> statement-breakpoint
CREATE TABLE "features" (
	"id" text PRIMARY KEY NOT NULL,
	"description" text NOT NULL,
	"perm_bit" integer NOT NULL,
	"perm_bit_index" integer NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "UK_features_perm_bit" UNIQUE("perm_bit","perm_bit_index")
);
--> statement-breakpoint
CREATE TABLE "hld_diagrams" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
	"interview_id" text NOT NULL,
	"topology" jsonb NOT NULL,
	"raw_diagram" jsonb NOT NULL,
	"phase" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	"created_by" text NOT NULL,
	"updated_by" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "interview_chats" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
	"interview_id" text NOT NULL,
	"role" integer NOT NULL,
	"content" jsonb NOT NULL,
	"phase" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "interviews" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"problem_id" integer NOT NULL,
	"status" integer DEFAULT 1 NOT NULL,
	"phase" integer DEFAULT 1 NOT NULL,
	"start_time" timestamp DEFAULT now() NOT NULL,
	"end_time" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "problems" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"functional_requirements" text[] NOT NULL,
	"non_functional_requirements" text[] NOT NULL,
	"bote_factors" text[] NOT NULL,
	"difficulty" text NOT NULL,
	"tags" text[],
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "red_flags" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
	"interview_id" text NOT NULL,
	"type" text NOT NULL,
	"reason" text NOT NULL,
	"phase" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "role_features" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
	"role_id" text NOT NULL,
	"feature_id" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "UK_role_features_role_id" UNIQUE("role_id","feature_id")
);
--> statement-breakpoint
CREATE TABLE "roles" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "scorecards" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
	"interview_id" text NOT NULL,
	"overall_grade" integer NOT NULL,
	"requirements_gathering" integer NOT NULL,
	"data_modeling" integer NOT NULL,
	"trade_off_analysis" integer NOT NULL,
	"scalability" integer NOT NULL,
	"strengths" text[] NOT NULL,
	"growth_areas" text[] NOT NULL,
	"actionable_feedback" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" timestamp,
	"image" text,
	"role_id" text NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
