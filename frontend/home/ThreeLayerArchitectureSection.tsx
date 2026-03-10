import { ArchitectureLayerCard } from "./cards/ArchitectureLayerCard";

export function ThreeLayerArchitectureSection() {
  return (
    <section className="container mx-auto px-4 py-20">
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-12 text-center">
          <div className="inline-flex items-center rounded-full border border-purple-200 bg-purple-50 px-3 py-1 text-sm font-medium text-purple-800 dark:border-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
            Server-Side Architecture
          </div>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-text-main sm:text-4xl">
            Production-Grade 3-Layer Architecture
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-text-muted">
            A strict separation of concerns that mimics scalable manufacturing
            lines. Logic flows downstream, data flows upstream.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <ArchitectureLayerCard
            layer="Layer 1: API Routes"
            file="app/api/interview/chat/route.ts"
            description="The 'Public Interface'. Handles protocol translation, validation, and response formatting."
            responsibilities={[
              "Zod Schema Validation",
              "NextAuth Authentication",
              "Rate Limiting",
              "Error Standardization",
            ]}
            technologies={["Next.js App Router", "Zod", "NextAuth"]}
            codeSnippet={`export const POST = validateRequest(
  { body: ZChatRequest },
  async (req) => {
    return await InterviewRepo.getStream(
      req.body
    );
  }
);`}
          />

          <ArchitectureLayerCard
            layer="Layer 2: Repository"
            file="backend/repositories/InterviewRepo.ts"
            description="The 'Brain'. unique business logic, AI orchestration, and multi-step workflows."
            responsibilities={[
              "LLM Context Window Mgmt",
              "Prompt Engineering",
              "Orchestration of DAL calls",
              "Streaming Logic",
            ]}
            technologies={["Vercel AI SDK", "Gemini 1.5 Pro", "LangChain"]}
            codeSnippet={`static async getStream(params) {
  // 1. Save User Msg
  await DAL.saveMsg(params);
  
  // 2. Hydrate Context
  const history = await DAL.getHistory();
  
  // 3. Stream LLM
  return streamText({ ... });
}`}
          />

          <ArchitectureLayerCard
            layer="Layer 3: Data Access"
            file="backend/dal/InterviewDAL.ts"
            description="The 'Vault'. Pure, type-safe database operations. No business logic allowed."
            responsibilities={[
              "Type-Safe Queries (Drizzle)",
              "Transaction Management",
              "Connection Pooling",
              "Data Migration",
            ]}
            technologies={["Drizzle ORM", "Neon Postgres", "SQL"]}
            codeSnippet={`static async saveMsg(data) {
  return await db
    .insert(messages)
    .values(data)
    .returning();
}`}
          />
        </div>
      </div>
    </section>
  );
}
