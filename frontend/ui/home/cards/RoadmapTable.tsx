"use client";

import { AppTable } from "@/frontend/ui/common/components/AppTable";
import { AppTableColumn } from "@/frontend/ui/common/components/AppTable/AppTable.types";

// ─── Constants ────────────────────────────────────────────────────────────────

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

type RoadmapItem = (typeof ROADMAP_ITEMS)[number];

const STATUS_COLOR_MAP: Record<RoadmapStatus, string> = {
  "In Development": "bg-chart-1/10 text-chart-1 border-chart-1/20",
  "Beta Testing": "bg-chart-2/10 text-chart-2 border-chart-2/20",
  Backlog: "bg-muted text-muted-foreground border-border",
  Planned: "bg-primary/10 text-primary border-primary/20",
};

// ─── Column Definitions ───────────────────────────────────────────────────────

const columns: AppTableColumn<RoadmapItem>[] = [
  {
    key: "feature",
    header: "Feature",
    cell: (row) => <span className="font-semibold">{row.feature}</span>,
  },
  {
    key: "technicalFocus",
    header: "Technical Focus",
    className: "text-sm text-muted-foreground",
  },
  {
    key: "status",
    header: "Status",
    cell: (row) => (
      <span
        className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${STATUS_COLOR_MAP[row.status]}`}
      >
        {row.status}
      </span>
    ),
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export function RoadmapTable() {
  return (
    <AppTable<RoadmapItem>
      columns={columns}
      data={ROADMAP_ITEMS}
      keyExtractor={(row) => row.feature}
    />
  );
}
