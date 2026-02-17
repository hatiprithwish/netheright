export function ArchitectureLayerCard({
  layer,
  file,
  description,
  responsibilities,
  technologies,
  codeSnippet,
}: {
  layer: string;
  file: string;
  description: string;
  responsibilities: string[];
  technologies: string[];
  codeSnippet: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h3 className="text-xl font-semibold">{layer}</h3>
          <p className="text-sm text-muted-foreground">{file}</p>
        </div>
      </div>
      <p className="mb-4 text-sm text-muted-foreground">{description}</p>
      <div className="mb-4">
        <h4 className="mb-2 text-sm font-semibold">Responsibilities:</h4>
        <ul className="space-y-1">
          {responsibilities.map((resp, i) => (
            <li key={i} className="flex items-start gap-2 text-sm">
              <span className="text-primary">→</span>
              <span className="text-muted-foreground">{resp}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="mb-4 flex flex-wrap gap-2">
        {technologies.map((tech, i) => (
          <span
            key={i}
            className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
          >
            {tech}
          </span>
        ))}
      </div>
      <div className="rounded-lg bg-muted p-4">
        <pre className="overflow-x-auto text-xs">
          <code>{codeSnippet}</code>
        </pre>
      </div>
    </div>
  );
}
