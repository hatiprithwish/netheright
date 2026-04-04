export function TechStackCategory({
  category,
  technologies,
}: {
  category: string;
  technologies: Array<{ name: string; purpose: string }>;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h3 className="mb-4 text-xl font-semibold">{category}</h3>
      <div className="space-y-3">
        {technologies.map((tech, i) => (
          <div key={i} className="flex items-start justify-between gap-4">
            <span className="font-medium">{tech.name}</span>
            <span className="text-sm text-muted-foreground">
              {tech.purpose}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
