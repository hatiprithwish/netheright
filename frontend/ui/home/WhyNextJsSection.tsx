import { Zap, Cloud, GitBranch, Layers } from "lucide-react";
import { ArchitectureDecisionCard } from "./cards/ArchitectureDecisionCard";

export function WhyNextJsSection() {
  return (
    <section
      id="architecture"
      className="container mx-auto px-4 py-20 border-t border-border"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
            Architecting the Architect: A look at the event-driven, RAG-enhanced
            pipeline powering this interviewer.
          </h2>
          <p className="text-lg text-muted-foreground">
            Strategic architectural decision optimizing for velocity and
            deployment simplicity
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2">
          <ArchitectureDecisionCard
            icon={<Layers className="h-8 w-8" />}
            title="Tight Integration"
            description="React Flow canvas and Server Actions validation in a single codebase. No CORS, no API versioning headaches, no duplicate type definitions."
            highlight="Reduced complexity by 40%"
          />
          <ArchitectureDecisionCard
            icon={<Cloud className="h-8 w-8" />}
            title="Deployment Simplicity"
            description="Single Vercel deployment vs managing separate frontend and backend infrastructure. Zero-config edge deployment with automatic HTTPS."
            highlight="Deploy in <2 minutes"
          />
          <ArchitectureDecisionCard
            icon={<Zap className="h-8 w-8" />}
            title="Focus on Core Value"
            description="Minimized DevOps overhead to focus on prompt engineering algorithms and AI interaction patterns. Time spent on features, not infrastructure."
            highlight="80% dev time on features"
          />
          <ArchitectureDecisionCard
            icon={<GitBranch className="h-8 w-8" />}
            title="Enterprise Patterns in Next.js"
            description="Implemented 3-layer architecture (API Routes → Repository → Data Access Layer) to demonstrate understanding of separation of concerns and scalable backend design."
            highlight="Production-ready patterns"
          />
        </div>
        <div className="mt-12 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-chart-1/5 p-8">
          <h3 className="mb-4 text-xl font-semibold">The Trade-off Analysis</h3>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h4 className="mb-2 font-semibold text-green-600 dark:text-green-400">
                ✓ When to Choose Monolith (This Project)
              </h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Rapid prototyping and iteration</li>
                <li>• Small to medium team size</li>
                <li>• Tight coupling between UI and backend logic</li>
                <li>• Simplified deployment and monitoring</li>
              </ul>
            </div>
            <div>
              <h4 className="mb-2 font-semibold text-orange-600 dark:text-orange-400">
                ✗ When to Choose Microservices
              </h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Multiple teams with different tech stacks</li>
                <li>• Independent scaling requirements</li>
                <li>• Polyglot persistence needs</li>
                <li>• Complex domain boundaries</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
