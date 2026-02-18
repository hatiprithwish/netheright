import { RoadmapTable } from "./cards/RoadmapTable";
import { ChangelogComponent } from "./cards/ChangelogComponent";
import { LiveCommitTicker } from "./cards/LiveCommitTicker";

export function UpcomingReleasesSection() {
  return (
    <section className="container mx-auto px-4 py-20 border-t border-border">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 text-center">
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
            Engineering Roadmap
          </h2>
          <p className="text-lg text-muted-foreground">
            Architectural improvements and scalability enhancements
          </p>
        </div>

        {/* Live Commit Ticker */}
        <div className="mb-8 flex justify-center">
          <LiveCommitTicker />
        </div>

        {/* Roadmap Table */}
        <div className="mb-12">
          <h3 className="mb-6 text-2xl font-semibold">
            Upcoming Architectural Improvements
          </h3>
          <RoadmapTable />
        </div>

        {/* Changelog and Technical Debt Side-by-Side */}
        <div className="grid gap-8 md:grid-cols-2">
          <ChangelogComponent />

          {/* Technical Debt / Scalability Goals */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="mb-4 text-xl font-semibold">
              Scalability & Technical Debt
            </h3>
            <div className="space-y-4">
              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <h4 className="mb-2 font-semibold">
                  Infrastructure as Code (IaC)
                </h4>
                <p className="text-sm text-muted-foreground">
                  Moving the deployment from manual Vercel pushes to a{" "}
                  <strong>Terraform</strong> managed AWS stack for better
                  infrastructure versioning and reproducibility.
                </p>
              </div>
              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <h4 className="mb-2 font-semibold">Load Testing</h4>
                <p className="text-sm text-muted-foreground">
                  Plan to run <strong>k6</strong> stress tests to determine the
                  maximum concurrent interview sessions the current Next.js
                  backend can handle before requiring horizontal scaling.
                </p>
              </div>
              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <h4 className="mb-2 font-semibold">Database Sharding</h4>
                <p className="text-sm text-muted-foreground">
                  Evaluating <strong>Neon&apos;s branching</strong> feature for
                  multi-tenant isolation and exploring sharding strategies for
                  sessions table as user base grows.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Flags Section */}
        <div className="mt-12 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-chart-1/5 p-8">
          <h3 className="mb-6 text-xl font-semibold">
            Beta Features (Feature Gating)
          </h3>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="flex items-center justify-between rounded-lg border border-border bg-background p-4">
              <div>
                <h4 className="font-semibold">AI Voice Mode</h4>
                <p className="text-sm text-muted-foreground">
                  Voice-based interview feedback
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-chart-2/10 px-3 py-1 text-xs font-semibold text-chart-2">
                  Beta
                </span>
                <button
                  disabled
                  className="relative inline-flex h-6 w-11 items-center rounded-full bg-muted transition-colors"
                >
                  <span className="inline-block h-4 w-4 translate-x-1 transform rounded-full bg-background transition-transform" />
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border bg-background p-4">
              <div>
                <h4 className="font-semibold">Collaborative Whiteboarding</h4>
                <p className="text-sm text-muted-foreground">
                  Real-time multi-user canvas
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  Planned
                </span>
                <button
                  disabled
                  className="relative inline-flex h-6 w-11 items-center rounded-full bg-muted transition-colors"
                >
                  <span className="inline-block h-4 w-4 translate-x-1 transform rounded-full bg-background transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
