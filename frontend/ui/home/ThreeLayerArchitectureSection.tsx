import { ArchitectureLayerCard } from "./cards/ArchitectureLayerCard";

export function ThreeLayerArchitectureSection() {
  return (
    <section className="container mx-auto px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
            3-Layer Backend Architecture
          </h2>
          <p className="text-lg text-muted-foreground">
            Mimicking formal Node.js backend patterns within Next.js App Router
          </p>
        </div>
        <div className="space-y-6">
          <ArchitectureLayerCard
            layer="Layer 1: API Routes"
            file="app/api/interview/chat/route.ts"
            description="HTTP request handlers with middleware validation"
            responsibilities={[
              "Request validation using Zod schemas",
              "Authentication via NextAuth",
              "Response formatting and error handling",
              "Delegates business logic to Repository layer",
            ]}
            technologies={["Next.js App Router", "Zod", "NextAuth"]}
            codeSnippet={`export const POST = validateRequest(
  { body: ZGetChatStreamRequest, requiresAuth: true },
  async (req: Request) => {
    const { messages, phase, sessionId } = await req.json();
    return await InterviewRepo.getChatStream({ 
      messages, phase, sessionId 
    });
  }
);`}
          />
          <ArchitectureLayerCard
            layer="Layer 2: Repository"
            file="backend/repositories/InterviewRepo.ts"
            description="Business logic orchestration and AI integration"
            responsibilities={[
              "Orchestrates multiple Data Access Layer (DAL) calls",
              "Integrates with Google Gemini AI",
              "Implements streaming response logic",
              "Handles complex business workflows",
            ]}
            technologies={["Vercel AI SDK", "Google Gemini", "TypeScript"]}
            codeSnippet={`static async getChatStream(params) {
  // 1. Persist user message
  await InterviewDAL.createMessage({...});
  
  // 2. Fetch conversation history
  const history = await InterviewDAL.getMessages(...);
  
  // 3. Stream AI response
  return streamText({ model: gemini(...), ... });
}`}
          />
          <ArchitectureLayerCard
            layer="Layer 3: Data Access Layer"
            file="backend/data-access-layer/InterviewDAL.ts"
            description="Raw database operations using Drizzle ORM"
            responsibilities={[
              "CRUD operations with type safety",
              "Database transaction management",
              "Query optimization and indexing",
              "No business logic - pure data access",
            ]}
            technologies={["Drizzle ORM", "Neon PostgreSQL", "TypeScript"]}
            codeSnippet={`static async createMessage({ sessionId, role, content }) {
  return await db.insert(aiChats).values({
    sessionId,
    role,
    content,
    phase,
  }).returning();
}`}
          />
        </div>
      </div>
    </section>
  );
}
