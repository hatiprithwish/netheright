import { Zap, Cloud, GitBranch, Layers } from "lucide-react";
import { ArchitectureDecisionCard } from "./cards/ArchitectureDecisionCard";

export function WhyNextJsSection() {
  return (
    <section
      id="architecture"
      className="border-t border-gray-200 bg-gray-50 py-24 dark:border-gray-800 dark:bg-slate-900/20"
    >
      <div className="container mx-auto px-4 max-w-[1400px]">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-text-main sm:text-4xl">
            Architecting the Architect
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-text-muted">
            Strategic decisions optimizing for velocity and deployment
            simplicity. Built on the Event-Driven, RAG-Enhanced pipeline.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <ArchitectureDecisionCard
            icon={<Layers className="h-6 w-6" />}
            title="Tight Integration"
            description="React Flow canvas and Server Actions validation in a single codebase. No CORS, no API versioning headaches, no duplicate type definitions."
            highlight="Reduced complexity by 40%"
          />
          <ArchitectureDecisionCard
            icon={<Cloud className="h-6 w-6" />}
            title="Deployment Simplicity"
            description="Single Vercel deployment vs managing separate frontend and backend infrastructure. Zero-config edge deployment with automatic HTTPS."
            highlight="Deploy in <2 minutes"
          />
          <ArchitectureDecisionCard
            icon={<Zap className="h-6 w-6" />}
            title="Focus on Core Value"
            description="Minimized DevOps overhead to focus on prompt engineering algorithms and AI interaction patterns. Time spent on features, not infrastructure."
            highlight="80% dev time on features"
          />
          <ArchitectureDecisionCard
            icon={<GitBranch className="h-6 w-6" />}
            title="Enterprise Patterns in Next.js"
            description="Implemented 3-layer architecture (API Routes → Repository → Data Access Layer) to demonstrate understanding of separation of concerns and scalable backend design."
            highlight="Production-ready patterns"
          />
        </div>

        {/* Trade-off Analysis Bento Box */}
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-8 dark:border-emerald-900/30 dark:bg-emerald-900/10">
            <h4 className="mb-4 flex items-center gap-2 text-lg font-bold text-emerald-700 dark:text-emerald-400">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-xs dark:bg-emerald-900">
                ✓
              </span>
              When to Choose Monolith (This Project)
            </h4>
            <ul className="space-y-3">
              {[
                "Rapid prototyping and iteration",
                "Small to medium team size",
                "Tight coupling between UI and backend logic",
                "Simplified deployment and monitoring",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2 text-sm text-emerald-900/80 dark:text-emerald-200/80"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-amber-100 bg-amber-50/50 p-8 dark:border-amber-900/30 dark:bg-amber-900/10">
            <h4 className="mb-4 flex items-center gap-2 text-lg font-bold text-amber-700 dark:text-amber-400">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 text-xs dark:bg-amber-900">
                ✗
              </span>
              When to Choose Microservices
            </h4>
            <ul className="space-y-3">
              {[
                "Multiple teams with different tech stacks",
                "Independent scaling requirements",
                "Polyglot persistence needs",
                "Complex domain boundaries",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2 text-sm text-amber-900/80 dark:text-amber-200/80"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400"></span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
