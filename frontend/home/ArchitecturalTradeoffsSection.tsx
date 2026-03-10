import { Check, X, Database, ArrowRightLeft, Activity } from "lucide-react";

export function ArchitecturalTradeoffsSection() {
  return (
    <section className="container mx-auto px-4 py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/30 to-transparent pointer-events-none" />
      <div className="mx-auto max-w-5xl relative">
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-800 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
            <ArrowRightLeft className="w-4 h-4" />
            System Design
          </div>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-text-main sm:text-4xl">
            Architectural Tradeoffs
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-text-muted">
            Engineering is about making conscious choices. Here is how we
            evaluate the classic pagination count problem for optimal
            performance.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Main API Card */}
          <div className="relative overflow-hidden rounded-2xl border bg-card p-8 shadow-sm transition-all hover:shadow-md">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-bold text-card-foreground">
                1. Count in Main API
              </h3>
              <div className="rounded-full bg-primary/10 p-2.5 text-primary">
                <Database className="h-5 w-5" />
              </div>
            </div>
            <p className="mb-6 text-sm text-muted-foreground">
              Returning{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 text-xs text-foreground">
                {"{ data: [], metadata: { totalCount } }"}
              </code>{" "}
              in a single request.
            </p>

            <div className="space-y-4">
              <div>
                <h4 className="flex items-center gap-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400 mb-2">
                  <Check className="h-4 w-4" /> Pros
                </h4>
                <ul className="space-y-2 text-sm text-card-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-muted-foreground">•</span> Reduced
                    network requests (single HTTP call)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-muted-foreground">•</span> Simpler
                    client logic (no race conditions)
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="flex items-center gap-2 text-sm font-semibold text-rose-600 dark:text-rose-400 mb-2">
                  <X className="h-4 w-4" /> Cons
                </h4>
                <ul className="space-y-2 text-sm text-card-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-muted-foreground">•</span> Database
                    performance hit due to full{" "}
                    <code className="text-xs">COUNT(*)</code> scans
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-muted-foreground">•</span> Tightly
                    coupled cache invalidation
                  </li>
                </ul>
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm font-medium text-foreground">
                  <span className="text-muted-foreground">Best For:</span>{" "}
                  Standard admin dashboards at moderate scale.
                </p>
              </div>
            </div>
          </div>

          {/* Separate API Card */}
          <div className="relative overflow-hidden rounded-2xl border bg-card p-8 shadow-sm transition-all hover:shadow-md">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-bold text-card-foreground">
                2. Separate API for Count
              </h3>
              <div className="rounded-full bg-chart-2/10 p-2.5 text-chart-2">
                <Activity className="h-5 w-5" />
              </div>
            </div>
            <p className="mb-6 text-sm text-muted-foreground">
              Using dedicated{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 text-xs text-foreground">
                /items
              </code>{" "}
              and{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 text-xs text-foreground">
                /items/count
              </code>{" "}
              endpoints.
            </p>

            <div className="space-y-4">
              <div>
                <h4 className="flex items-center gap-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400 mb-2">
                  <Check className="h-4 w-4" /> Pros
                </h4>
                <ul className="space-y-2 text-sm text-card-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-muted-foreground">•</span> Performance
                    optimization (skip count for infinite scroll)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-muted-foreground">•</span> Independent
                    caching and client parallelism
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="flex items-center gap-2 text-sm font-semibold text-rose-600 dark:text-rose-400 mb-2">
                  <X className="h-4 w-4" /> Cons
                </h4>
                <ul className="space-y-2 text-sm text-card-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-muted-foreground">•</span> Increased
                    request volume to the server
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-muted-foreground">•</span> Potential
                    UI inconsistency if data mutates between calls
                  </li>
                </ul>
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm font-medium text-foreground">
                  <span className="text-muted-foreground">Best For:</span>{" "}
                  Tables with millions of rows, infinite scroll.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-xl bg-muted/40 p-6 text-center text-sm border">
          <p className="text-foreground">
            <span className="font-semibold px-2 py-0.5 rounded bg-primary/10 text-primary uppercase text-xs mr-2">
              Recommendation
            </span>{" "}
            Default to the main API for typical use-cases. For high-scale
            applications, use a separate API or an optional parameter{" "}
            <code className="text-xs">?includeCount=true</code> to give the
            client control.
          </p>
        </div>
      </div>
    </section>
  );
}
