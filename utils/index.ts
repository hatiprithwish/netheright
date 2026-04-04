import type { Node, Edge } from "@xyflow/react";
import * as Schemas from "@/schemas";
import Constants from "@/constants";
import dayjs from "dayjs";

class Utilities {
  static sanitizeGraph(nodes: Node[], edges: Edge[]): Schemas.SanitizedGraph {
    const sanitizedNodes: Schemas.SanitizedNode[] = nodes.map((node) => ({
      id: node.id,
      name: (node.data.name as string) || "Untitled",
      notes: (node.data.notes as string) || "",
    }));

    const sanitizedEdges: Schemas.SanitizedEdge[] = edges.map((edge) => ({
      from: edge.source,
      to: edge.target,
      label: (edge.label as string) || null,
    }));

    return {
      nodes: sanitizedNodes,
      connections: sanitizedEdges,
    };
  }

  static graphToString(graph: Schemas.SanitizedGraph): string {
    const nodeMap = new Map(graph.nodes.map((n) => [n.id, n.name]));

    return graph.connections
      .map((conn) => {
        const fromName = nodeMap.get(conn.from) || conn.from;
        const toName = nodeMap.get(conn.to) || conn.to;
        const label = conn.label ? ` --[${conn.label}]--> ` : " --> ";
        return `${fromName}${label}${toName}`;
      })
      .join("\n");
  }

  static exportGraphJSON(graph: Schemas.SanitizedGraph, pretty = true): string {
    return JSON.stringify(graph, null, pretty ? 2 : 0);
  }

  static getBadgeColor = (variant: Schemas.BadgeColor): string => {
    switch (variant) {
      case Schemas.BadgeColor.Green:
        return "text-emerald-700 bg-emerald-50 border border-emerald-100 dark:text-emerald-400 dark:bg-emerald-950/30 dark:border-emerald-900/50";
      case Schemas.BadgeColor.Yellow:
        return "text-amber-700 bg-amber-50 border border-amber-100 dark:text-amber-400 dark:bg-amber-950/30 dark:border-amber-900/50";
      case Schemas.BadgeColor.Red:
        return "text-red-700 bg-red-50 border border-red-100 dark:text-red-400 dark:bg-red-950/30 dark:border-red-900/50";
      case Schemas.BadgeColor.Blue:
        return "text-blue-700 bg-blue-50 border border-blue-100 dark:text-blue-400 dark:bg-blue-950/30 dark:border-blue-900/50";
      case Schemas.BadgeColor.Gray:
      default:
        return "text-gray-700 bg-gray-50 border border-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:border-gray-700";
    }
  };

  static formatDate = (
    date?: string | null,
    format: string = Constants.DEFAULT_DATE_FORMAT,
  ) => {
    if (!date) return date;
    return dayjs(date).format(format);
  };
}

export default Utilities;
