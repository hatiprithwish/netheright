import { DatabaseTableCard } from "./cards/DatabaseTableCard";

export default function DatabaseSchemaSection() {
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
            tableName="interviews"
            description="Interview session tracking"
            columns={[
              { name: "id", type: "UUID", note: "Primary key" },
              { name: "user_id", type: "TEXT", note: "Foreign key" },
              { name: "problem_id", type: "INTEGER" },
              { name: "status", type: "INTEGER" },
              { name: "phase", type: "INTEGER" },
              { name: "start_time", type: "TIMESTAMP" },
              { name: "end_time", type: "TIMESTAMP" },
              { name: "is_test", type: "BOOLEAN" },
            ]}
            designDecision="UUID for distributed system compatibility"
          />
          <DatabaseTableCard
            tableName="interview_chats"
            description="Conversation history per phase"
            columns={[
              { name: "id", type: "BIGINT", note: "Auto-increment" },
              { name: "interview_id", type: "TEXT", note: "Foreign key" },
              { name: "role", type: "INTEGER", note: "User/Assistant" },
              { name: "content", type: "JSONB", note: "Flexible schema" },
              { name: "phase", type: "INTEGER" },
            ]}
            designDecision="JSONB for flexible message content structure"
          />
          <DatabaseTableCard
            tableName="scorecards"
            description="AI-generated performance evaluation"
            columns={[
              { name: "id", type: "BIGINT" },
              { name: "interview_id", type: "TEXT", note: "Foreign key" },
              { name: "overall_grade", type: "INTEGER" },
              { name: "requirements_gathering", type: "INTEGER" },
              { name: "data_modeling", type: "INTEGER" },
              { name: "trade_off_analysis", type: "INTEGER" },
              { name: "scalability", type: "INTEGER" },
              { name: "strengths", type: "TEXT[]", note: "Array" },
              { name: "growth_areas", type: "TEXT[]", note: "Array" },
              { name: "actionable_feedback", type: "TEXT" },
            ]}
            designDecision="Denormalized for fast scorecard retrieval"
          />
        </div>
      </div>
    </section>
  );
}
