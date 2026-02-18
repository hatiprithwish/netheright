const ROADMAP_ITEMS = [
  {
    feature: "Distributed Tracing",
    technicalFocus:
      "Implementing OpenTelemetry to monitor LLM call latency across the pipeline.",
    status: "In Development" as const,
  },
  {
    feature: "Multi-Agent Debates",
    technicalFocus:
      'Using LangGraph to let two AI "Senior Architects" debate the user\'s design.',
    status: "Beta Testing" as const,
  },
  {
    feature: "Vector DB Optimization",
    technicalFocus:
      "Moving from flat-file storage to Pinecone for faster RAG-based retrieval.",
    status: "Backlog" as const,
  },
  {
    feature: "WebSocket Integration",
    technicalFocus:
      "Shifting from HTTP Polling to WebSockets for real-time collaborative whiteboarding.",
    status: "Planned" as const,
  },
];

type RoadmapStatus = "In Development" | "Beta Testing" | "Backlog" | "Planned";

function getStatusColor(status: RoadmapStatus): string {
  switch (status) {
    case "In Development":
      return "bg-chart-1/10 text-chart-1 border-chart-1/20";
    case "Beta Testing":
      return "bg-chart-2/10 text-chart-2 border-chart-2/20";
    case "Backlog":
      return "bg-muted text-muted-foreground border-border";
    case "Planned":
      return "bg-primary/10 text-primary border-primary/20";
  }
}

export function RoadmapTable() {
  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full">
        <thead className="border-b border-border bg-muted/50">
          <tr>
            <th className="px-6 py-4 text-left text-sm font-semibold">
              Feature
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold">
              Technical Focus
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {ROADMAP_ITEMS.map((item, i) => (
            <tr key={i} className="transition-colors hover:bg-muted/30">
              <td className="px-6 py-4">
                <span className="font-semibold">{item.feature}</span>
              </td>
              <td className="px-6 py-4 text-sm text-muted-foreground">
                {item.technicalFocus}
              </td>
              <td className="px-6 py-4">
                <span
                  className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${getStatusColor(item.status)}`}
                >
                  {item.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
