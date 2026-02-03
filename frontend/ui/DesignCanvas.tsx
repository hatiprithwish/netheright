"use client";

import { useCallback, useRef, useState } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  type Connection,
  type Edge,
  type Node,
  type OnConnect,
  type ReactFlowInstance,
  Panel,
  MarkerType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Plus, Download, FileJson } from "lucide-react";
import {
  sanitizeGraph,
  graphToString,
  exportGraphJSON,
} from "@/lib/serializeGraph";
import CustomNode, { type CustomNodeData } from "./CustomNode";

// Register custom node types
const nodeTypes = {
  custom: CustomNode,
} as const;

export default function DesignCanvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node<CustomNodeData>>(
    [],
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [nodeIdCounter, setNodeIdCounter] = useState(1);

  const onConnect: OnConnect = useCallback(
    (params: Connection) => {
      const newEdge = {
        ...params,
        type: "default",
        animated: true,
        label: "connects to",
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 20,
          height: 20,
          color: "#3b82f6",
        },
        style: {
          stroke: "#3b82f6",
          strokeWidth: 2,
        },
      };
      setEdges((eds) => addEdge(newEdge, eds));
    },
    [setEdges],
  );

  const addNode = useCallback(() => {
    const newNode: Node<CustomNodeData> = {
      id: `node-${nodeIdCounter}`,
      type: "custom",
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: {
        name: `Node ${nodeIdCounter}`,
        notes: "",
      },
    };

    setNodes((nds) => [...nds, newNode]);
    setNodeIdCounter((prev) => prev + 1);
  }, [nodeIdCounter, setNodes]);

  const handleEdgeLabelChange = useCallback(
    (edgeId: string, newLabel: string) => {
      setEdges((eds) =>
        eds.map((edge) =>
          edge.id === edgeId ? { ...edge, label: newLabel } : edge,
        ),
      );
    },
    [setEdges],
  );

  const onEdgeClick = useCallback(
    (event: React.MouseEvent, edge: Edge) => {
      const newLabel = prompt(
        "Enter edge label:",
        (edge.label as string) || "",
      );
      if (newLabel !== null) {
        handleEdgeLabelChange(edge.id, newLabel);
      }
    },
    [handleEdgeLabelChange],
  );

  const handleExportJSON = () => {
    const serialized = sanitizeGraph(nodes, edges);
    const json = exportGraphJSON(serialized);

    // Create download
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `graph-topology-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleViewTopology = () => {
    const serialized = sanitizeGraph(nodes, edges);
    const readable = graphToString(serialized);

    alert(
      `Graph Topology:\n\n${readable || "No connections yet"}\n\nJSON:\n${exportGraphJSON(serialized)}`,
    );
  };

  return (
    <div className="flex h-screen w-full">
      {/* Sidebar */}
      <aside className="w-64 border-r border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          Design Canvas
        </h2>

        {/* Add Node Button */}
        <button
          onClick={addNode}
          className="mb-4 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white shadow-md transition-all hover:bg-blue-700"
        >
          <Plus className="h-5 w-5" />
          Add Node
        </button>

        <div className="mb-4 rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-700 dark:bg-zinc-800">
          <p className="text-xs text-zinc-600 dark:text-zinc-400">
            <strong>Tip:</strong> Click a node to edit its name and notes.
            Connect nodes by dragging from the bottom handle to the top handle
            of another node. Click an edge to change its label.
          </p>
        </div>

        {/* Export Section */}
        <div className="mt-6 space-y-2">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
            Export Topology
          </h3>
          <button
            onClick={handleExportJSON}
            disabled={nodes.length === 0}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-md transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Download className="h-4 w-4" />
            Download JSON
          </button>
          <button
            onClick={handleViewTopology}
            disabled={nodes.length === 0}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow-md transition-all hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FileJson className="h-4 w-4" />
            View Topology
          </button>
        </div>
      </aside>

      {/* Canvas */}
      <div className="flex-1">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onEdgeClick={onEdgeClick}
          nodeTypes={nodeTypes as any}
          fitView
          defaultEdgeOptions={{
            animated: true,
            type: "default",
            markerEnd: { type: MarkerType.ArrowClosed },
          }}
          className="bg-zinc-50 dark:bg-zinc-950"
        >
          <Background />
          <Controls />
          <MiniMap />
          <Panel
            position="top-right"
            className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-2"
          >
            <div className="text-xs text-zinc-600 dark:text-zinc-400">
              Nodes: {nodes.length} | Edges: {edges.length}
            </div>
          </Panel>
        </ReactFlow>
      </div>
    </div>
  );
}
