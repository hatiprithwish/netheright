import type { Node, Edge } from "@xyflow/react";
import * as Schemas from "@/schemas";

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
}

export default Utilities;
