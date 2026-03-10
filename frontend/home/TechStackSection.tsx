import { TechStackCategory } from "./cards/TechStackCategory";

export function TechStackSection() {
  return (
    <section
      id="tech"
      className="container mx-auto px-4 py-20 border-t border-border"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
            Technology Stack
          </h2>
          <p className="text-lg text-muted-foreground">
            Modern, type-safe, and production-ready
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2">
          <TechStackCategory
            category="Frontend"
            technologies={[
              { name: "Next.js 15", purpose: "App Router + Server Actions" },
              { name: "React 19", purpose: "UI components" },
              { name: "React Flow", purpose: "Architecture diagrams" },
              { name: "Tailwind CSS", purpose: "Styling system" },
              { name: "Zustand", purpose: "State management" },
            ]}
          />
          <TechStackCategory
            category="Backend"
            technologies={[
              { name: "Next.js API Routes", purpose: "HTTP handlers" },
              { name: "Vercel AI SDK", purpose: "LLM streaming" },
              { name: "Google Gemini", purpose: "AI model" },
              { name: "NextAuth", purpose: "Authentication" },
              { name: "Zod", purpose: "Schema validation" },
            ]}
          />
          <TechStackCategory
            category="Database"
            technologies={[
              { name: "Neon PostgreSQL", purpose: "Serverless database" },
              { name: "Drizzle ORM", purpose: "Type-safe queries" },
              { name: "Drizzle Kit", purpose: "Migrations" },
            ]}
          />
          <TechStackCategory
            category="DevOps & Monitoring"
            technologies={[
              { name: "Vercel", purpose: "Edge deployment" },
              { name: "Sentry", purpose: "Error tracking" },
              { name: "Pino", purpose: "Structured logging" },
              { name: "TypeScript", purpose: "Type safety" },
            ]}
          />
        </div>
      </div>
    </section>
  );
}
