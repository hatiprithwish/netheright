import { MetricCard } from "./cards/MetricCard";

export function MetricsSection() {
  return (
    <section className="container mx-auto px-4 py-20 border-t border-border">
      <div className="mx-auto max-w-4xl">
        <div className="grid gap-8 sm:grid-cols-3">
          <MetricCard number="50+" label="System Design Scenarios" />
          <MetricCard number="<200ms" label="Average Feedback Latency" />
          <MetricCard number="3" label="Interview Phases" />
        </div>
      </div>
    </section>
  );
}
