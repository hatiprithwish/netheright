export function ProductionFeatureCard({
  title,
  description,
  metric,
}: {
  title: string;
  description: string;
  metric: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <h4 className="mb-2 font-semibold">{title}</h4>
      <p className="mb-3 text-sm text-muted-foreground">{description}</p>
      <div className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
        {metric}
      </div>
    </div>
  );
}
