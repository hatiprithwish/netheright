export default function MetricsSection() {
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

function MetricCard({ number, label }: { number: string; label: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-8 text-center">
      <div className="mb-2 text-4xl font-bold text-primary">{number}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
}
