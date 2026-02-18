import { DatabaseTableCard } from "./cards/DatabaseTableCard";

export function DatabaseSchemaSection() {
  return (
    <section className="container mx-auto px-4 py-20 border-t border-border">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
            Database Schema Design
          </h2>
          <p className="text-lg text-muted-foreground">
            PostgreSQL with strategic use of JSONB for flexibility
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <DatabaseTableCard
            tableName="sdi_sessions"
            description="Interview session tracking"
            columns={[
              { name: "id", type: "UUID", note: "Primary key" },
              { name: "user_id", type: "TEXT", note: "Foreign key" },
              { name: "problem_id", type: "INTEGER" },
              { name: "current_phase", type: "INTEGER" },
              { name: "status", type: "INTEGER" },
              { name: "start_time", type: "TIMESTAMP" },
            ]}
            designDecision="UUID for distributed system compatibility"
          />
          <DatabaseTableCard
            tableName="ai_chats"
            description="Conversation history per phase"
            columns={[
              { name: "id", type: "BIGSERIAL", note: "Auto-increment" },
              { name: "session_id", type: "UUID", note: "Foreign key" },
              { name: "role", type: "INTEGER", note: "User/Assistant" },
              { name: "content", type: "JSONB", note: "Flexible schema" },
              { name: "phase", type: "INTEGER" },
            ]}
            designDecision="JSONB for flexible message content structure"
          />
          <DatabaseTableCard
            tableName="sdi_scorecards"
            description="AI-generated performance evaluation"
            columns={[
              { name: "id", type: "BIGSERIAL" },
              { name: "session_id", type: "UUID" },
              { name: "overall_grade", type: "INTEGER" },
              { name: "strengths", type: "TEXT[]", note: "Array" },
              { name: "growth_areas", type: "TEXT[]" },
              { name: "actionable_feedback", type: "TEXT" },
            ]}
            designDecision="Denormalized for fast scorecard retrieval"
          />
        </div>
      </div>
    </section>
  );
}
