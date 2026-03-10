import { useCallback, useMemo } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  Connection,
  Node,
  Panel,
  MarkerType,
  Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useInterviewStore } from "../../../zustand";
import { Plus, Trash2 } from "lucide-react";
import { CustomNode } from "./CustomNode";
import { CustomEdge } from "./CustomEdge";
import { useTheme } from "next-themes";

export function HLDCanvas() {
  const { theme, systemTheme } = useTheme();
  const colorMode = theme === "system" ? systemTheme : theme;

  const nodes = useInterviewStore((state) => state.nodes);
  const edges = useInterviewStore((state) => state.edges);
  const onNodesChange = useInterviewStore((state) => state.onNodesChange);
  const onEdgesChange = useInterviewStore((state) => state.onEdgesChange);
  const setEdges = useInterviewStore((state) => state.setEdges);
  const addNode = useInterviewStore((state) => state.addNode);
  const setNodes = useInterviewStore((state) => state.setNodes);
  const updateNodeData = useInterviewStore((state) => state.updateNodeData);

  const nodeTypes = useMemo(() => ({ systemNode: CustomNode }), []);
  const edgeTypes = useMemo(() => ({ customEdge: CustomEdge }), []);

  const onConnect = useCallback(
    (params: Connection) => {
      const newEdge = {
        ...params,
        type: "customEdge",
        markerEnd: {
          type: MarkerType.ArrowClosed,
        },
        style: { strokeWidth: 2 },
      };
      setEdges(addEdge(newEdge, edges));
    },
    [edges, setEdges],
  );

  const handleAddNode = () => {
    const id = `node-${nodes.length + 1}`;
    const newNode: Node = {
      id,
      position: { x: Math.random() * 400 + 50, y: Math.random() * 400 + 50 },
      data: { name: "", notes: "" },
      type: "systemNode",
    };
    addNode(newNode);
  };

  const clearCanvas = () => {
    if (confirm("Are you sure you want to clear the canvas?")) {
      setNodes([]);
      setEdges([]);
    }
  };

  return (
    <div className="h-full w-full bg-background border rounded-xl overflow-hidden relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        colorMode={colorMode === "dark" ? "dark" : "light"}
        defaultEdgeOptions={{
          type: "customEdge",
          markerEnd: { type: MarkerType.ArrowClosed },
        }}
      >
        <Background />

        <Panel position="top-right" className="flex gap-2">
          <button
            onClick={handleAddNode}
            className="bg-card p-2 rounded shadow-md hover:bg-muted border border-border transition-colors cursor-pointer"
            title="Add Node"
          >
            <Plus className="w-5 h-5 text-foreground" />
          </button>
          <button
            onClick={clearCanvas}
            className="bg-card p-2 rounded shadow-md hover:bg-muted border border-border transition-colors cursor-pointer"
            title="Clear Canvas"
          >
            <Trash2 className="w-5 h-5 text-red-500 hover:text-red-600" />
          </button>
        </Panel>
      </ReactFlow>
    </div>
  );
}
