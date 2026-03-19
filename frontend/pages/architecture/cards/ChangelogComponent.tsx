const CHANGELOG_ENTRIES = [
  {
    version: "v1.2.0 - The Latency Update",
    changes: [
      "Implemented Redis Caching for common architectural patterns, reducing API costs by 30%.",
      "Migrated frontend state management to Zustand for smoother whiteboard interactions.",
      "Optimized LLM System Prompts to reduce hallucination in DB Sharding scenarios.",
    ],
  },
  {
    version: "v1.1.0 - The Streaming Update",
    changes: [
      "Integrated Vercel AI SDK for streaming LLM responses with <200ms TTFB.",
      "Implemented 3-layer architecture (API Routes → Repository → DAL).",
      "Added Zod schema validation across all API endpoints.",
    ],
  },
  {
    version: "v1.0.0 - Initial Release",
    changes: [
      "Built React Flow canvas for interactive architecture diagrams.",
      "Integrated Google Gemini for AI-powered feedback.",
      "Deployed on Vercel Edge Network with Neon PostgreSQL.",
    ],
  },
];

export function ChangelogComponent() {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h3 className="mb-4 text-xl font-semibold">Changelog</h3>
      <div className="max-h-96 space-y-6 overflow-y-auto pr-2">
        {CHANGELOG_ENTRIES.map((entry, i) => (
          <div key={i} className="border-l-2 border-primary/30 pl-4">
            <h4 className="mb-2 font-semibold text-primary">{entry.version}</h4>
            <ul className="space-y-1">
              {entry.changes.map((change, j) => (
                <li key={j} className="flex items-start gap-2 text-sm">
                  <span className="text-primary">•</span>
                  <span className="text-muted-foreground">{change}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
