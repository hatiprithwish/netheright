import { Code2, Shield, Layers, GitBranch, Server, Lock } from "lucide-react";
import { CodeQualityCard } from "./cards/CodeQualityCard";

export function CodeQualitySection() {
  return (
    <section className="container mx-auto px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
            Code Quality Standards
          </h2>
          <p className="text-lg text-muted-foreground">
            Best practices and engineering principles
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <CodeQualityCard
            icon={<Code2 className="h-8 w-8" />}
            title="TypeScript Strict Mode"
            description="Full type safety across frontend and backend with strict compiler options"
          />
          <CodeQualityCard
            icon={<Shield className="h-8 w-8" />}
            title="Zod Schema Validation"
            description="Runtime type validation for all API requests and database operations"
          />
          <CodeQualityCard
            icon={<Layers className="h-8 w-8" />}
            title="Separation of Concerns"
            description="3-layer architecture ensures testability and maintainability"
          />
          <CodeQualityCard
            icon={<GitBranch className="h-8 w-8" />}
            title="DRY Principles"
            description="Constants, enums, and shared schemas eliminate code duplication"
          />
          <CodeQualityCard
            icon={<Server className="h-8 w-8" />}
            title="Repository Pattern"
            description="Business logic isolated from data access for easy testing"
          />
          <CodeQualityCard
            icon={<Lock className="h-8 w-8" />}
            title="Immutable State"
            description="Zustand with immer for predictable state management"
          />
        </div>
      </div>
    </section>
  );
}
