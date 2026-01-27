import type { Node, Edge } from "@xyflow/react";

/**
 * Serialized node representation without UI-specific data
 */
export interface SerializedNode {
  id: string;
  name: string;
  notes: string;
}

/**
 * Serialized edge representation showing connections
 */
export interface SerializedEdge {
  from: string;
  to: string;
  label?: string;
}

/**
 * Clean graph topology without UI coordinates
 */
export interface SerializedGraph {
  nodes: SerializedNode[];
  connections: SerializedEdge[];
}

/**
 * Strips UI data (x/y coordinates, styles) and returns a clean JSON topology
 * showing which nodes connect to which other nodes.
 * 
 * @param nodes - Array of React Flow nodes
 * @param edges - Array of React Flow edges
 * @returns Clean graph topology with nodes and their connections
 * 
 * @example
 * ```typescript
 * const topology = serializeGraph(nodes, edges);
 * // Returns:
 * // {
 * //   nodes: [
 * //     { id: "node-1", name: "Service 1", notes: "Main API service" },
 * //     { id: "node-2", name: "Database 1", notes: "PostgreSQL" }
 * //   ],
 * //   connections: [
 * //     { from: "node-1", to: "node-2", label: "connects to" }
 * //   ]
 * // }
 * ```
 */
export function serializeGraph(nodes: Node[], edges: Edge[]): SerializedGraph {
  // Extract only essential node data, stripping UI-specific properties
  const serializedNodes: SerializedNode[] = nodes.map((node) => ({
    id: node.id,
    name: (node.data.name as string) || "Untitled",
    notes: (node.data.notes as string) || "",
  }));

  // Extract connection information without UI data
  const serializedEdges: SerializedEdge[] = edges.map((edge) => ({
    from: edge.source,
    to: edge.target,
    label: edge.label as string | undefined,
  }));

  return {
    nodes: serializedNodes,
    connections: serializedEdges,
  };
}

/**
 * Converts serialized graph to a human-readable string representation
 * 
 * @param graph - Serialized graph topology
 * @returns Human-readable string showing connections
 * 
 * @example
 * ```typescript
 * const readable = graphToString(topology);
 * // Returns:
 * // "Service 1 -> Database 1"
 * // "API 1 -> Service 1"
 * ```
 */
export function graphToString(graph: SerializedGraph): string {
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

/**
 * Exports the serialized graph as a JSON string
 * 
 * @param graph - Serialized graph topology
 * @param pretty - Whether to format JSON with indentation
 * @returns JSON string representation
 */
export function exportGraphJSON(graph: SerializedGraph, pretty = true): string {
  return JSON.stringify(graph, null, pretty ? 2 : 0);
}
