export function MetricCard({
  number,
  label,
}: {
  number: string;
  label: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-8 text-center">
      <div className="mb-2 text-4xl font-bold text-primary">{number}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
}
