CREATE TYPE "public"."diagram_phase" AS ENUM('high_level', 'deep_dive');--> statement-breakpoint
CREATE TYPE "public"."phase" AS ENUM('scope', 'high_level', 'deep_dive', 'scorecard');--> statement-breakpoint
CREATE TYPE "public"."session_status" AS ENUM('in_progress', 'completed', 'abandoned');--> statement-breakpoint
CREATE TYPE "public"."grade" AS ENUM('S', 'A', 'B', 'C', 'F');--> statement-breakpoint
CREATE TABLE "diagrams" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"session_id" bigint NOT NULL,
	"topology" jsonb NOT NULL,
	"raw_react_flow" jsonb NOT NULL,
	"phase" "diagram_phase" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sdi_sessions" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"problem_id" text NOT NULL,
	"status" "session_status" DEFAULT 'in_progress' NOT NULL,
	"current_phase" "phase" DEFAULT 'scope' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"completed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"session_id" bigint NOT NULL,
	"role" "message_role" NOT NULL,
	"content" text NOT NULL,
	"phase" "phase" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "scorecards" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"session_id" bigint NOT NULL,
	"overall_grade" "grade" NOT NULL,
	"requirements_gathering" integer NOT NULL,
	"data_modeling" integer NOT NULL,
	"trade_off_analysis" integer NOT NULL,
	"scalability" integer NOT NULL,
	"strengths" text[] NOT NULL,
	"growth_areas" text[] NOT NULL,
	"actionable_feedback" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "scorecards_session_id_unique" UNIQUE("session_id")
);
--> statement-breakpoint
DROP TABLE "chat_messages" CASCADE;--> statement-breakpoint
DROP TABLE "phase_validations" CASCADE;--> statement-breakpoint
DROP TABLE "practice_sessions" CASCADE;--> statement-breakpoint
DROP TABLE "system_design_problems" CASCADE;--> statement-breakpoint
DROP TABLE "user_requirements" CASCADE;--> statement-breakpoint
ALTER TABLE "diagrams" ADD CONSTRAINT "diagrams_session_id_sdi_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."sdi_sessions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sdi_sessions" ADD CONSTRAINT "sdi_sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_session_id_sdi_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."sdi_sessions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scorecards" ADD CONSTRAINT "scorecards_session_id_sdi_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."sdi_sessions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "diagrams_session_id_idx" ON "diagrams" USING btree ("session_id");--> statement-breakpoint
CREATE INDEX "messages_session_id_idx" ON "messages" USING btree ("session_id");--> statement-breakpoint
CREATE INDEX "messages_session_phase_idx" ON "messages" USING btree ("session_id","phase");--> statement-breakpoint
DROP TYPE "public"."difficulty";--> statement-breakpoint
DROP TYPE "public"."requirement_type";