export function DatabaseTableCard({
  tableName,
  description,
  columns,
  designDecision,
}: {
  tableName: string;
  description: string;
  columns: Array<{ name: string; type: string; note?: string }>;
  designDecision: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h3 className="mb-2 font-mono text-lg font-semibold">{tableName}</h3>
      <p className="mb-4 text-sm text-muted-foreground">{description}</p>
      <div className="mb-4 space-y-2">
        {columns.map((col, i) => (
          <div key={i} className="flex items-start gap-2 text-sm">
            <span className="font-mono text-primary">{col.name}</span>
            <span className="text-muted-foreground">{col.type}</span>
            {col.note && (
              <span className="text-xs text-muted-foreground">
                ({col.note})
              </span>
            )}
          </div>
        ))}
      </div>
      <div className="rounded-lg bg-primary/5 p-3">
        <p className="text-xs text-muted-foreground">
          <strong>Design:</strong> {designDecision}
        </p>
      </div>
    </div>
  );
}
